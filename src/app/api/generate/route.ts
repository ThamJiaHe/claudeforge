import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildMetaPrompt } from '@/lib/engine/meta-prompt-builder';
import { MODELS, FORMATS } from '@/lib/constants';
import type { GenerationParams } from '@/lib/types';

export const runtime = 'nodejs';

// Allow up to 60 s on Vercel Hobby (default is only 10 s for Node.js functions).
// The Anthropic API streaming call often exceeds the 10 s default.
export const maxDuration = 60;

// ── In-memory sliding-window rate limiter ──────────────────────
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_MAX_REQUESTS = 20; // per IP per window
const ipLog = new Map<string, number[]>();

function isAllowed(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;

  let timestamps = ipLog.get(ip) ?? [];
  timestamps = timestamps.filter((t) => t > cutoff);

  if (timestamps.length >= RATE_MAX_REQUESTS) {
    ipLog.set(ip, timestamps);
    return false;
  }

  timestamps.push(now);
  ipLog.set(ip, timestamps);

  // Inline GC: prune stale IPs when map grows large
  if (ipLog.size > 10_000) {
    for (const [key, ts] of ipLog) {
      if (ts.every((t) => t <= cutoff)) ipLog.delete(key);
    }
  }

  return true;
}

// ── Allowed values for strict validation ───────────────────────
const VALID_MODEL_IDS = new Set(MODELS.map((m) => m.id));
const VALID_FORMAT_IDS = new Set(FORMATS.map((f) => f.id));
const VALID_EFFORTS = new Set(['low', 'medium', 'high', 'max']);
const MAX_TEXT_LENGTH = 50_000;
const MAX_OUTPUT_TOKENS = 128_000;

/**
 * Extract a human-readable detail from an Anthropic API error.
 * The SDK often wraps the JSON response in its message; we parse out the
 * inner "message" field so the user sees actionable information.
 */
function extractApiDetail(raw: string): string {
  // Try to pull the inner "message" from a JSON body embedded in the string
  const jsonMatch = raw.match(/"message"\s*:\s*"([^"]+)"/);
  if (jsonMatch?.[1]) return jsonMatch[1];
  // Fallback: use the raw message, but strip HTTP status prefix (e.g. "400 {…}")
  const cleaned = raw.replace(/^\d{3}\s*/, '').trim();
  return cleaned.length > 0 && cleaned.length < 300 ? cleaned : 'Unknown error';
}

/** Sanitise Anthropic SDK errors so no API keys or internals leak to client */
function sanitizeError(error: unknown): string {
  // Always log full error server-side for debugging (visible in Vercel logs)
  console.error('[generate] API error:', error);

  // ── Anthropic SDK structured errors (preferred — most accurate) ──
  if (error instanceof Anthropic.AuthenticationError) {
    return 'Invalid API key. Please check your Anthropic API key.';
  }
  if (error instanceof Anthropic.RateLimitError) {
    return 'Rate limit exceeded. Please wait and try again.';
  }
  if (error instanceof Anthropic.PermissionDeniedError) {
    return 'Your API key does not have permission to use this model.';
  }
  if (error instanceof Anthropic.NotFoundError) {
    return `Model not found: ${extractApiDetail(error.message)}. Please choose a supported Claude model or update your SDK.`;
  }
  if (error instanceof Anthropic.BadRequestError) {
    // BadRequestError describes parameter issues (not API keys) — safe to surface
    return `Invalid request: ${extractApiDetail(error.message)}`;
  }
  if (error instanceof Anthropic.InternalServerError) {
    return 'Anthropic API server error. Please retry in a moment.';
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return 'Could not reach the Anthropic API. Please check your connection and try again.';
  }
  if (error instanceof Anthropic.APIError) {
    // Catch-all for other API errors
    const detail = extractApiDetail(error.message);
    return `API error (${error.status ?? 'unknown'}): ${detail}`;
  }

  // ── Non-SDK errors — fall back to string matching ──────────────
  const msg = String(error).toLowerCase();

  if (msg.includes('overloaded') || msg.includes('529'))
    return 'Anthropic API is temporarily overloaded. Please retry.';

  if (msg.includes('timeout') || msg.includes('aborted') || msg.includes('econnreset') || msg.includes('function_invocation_timeout'))
    return 'Request timed out. Please try again with a shorter prompt or a faster model.';

  if (msg.includes('econnrefused') || msg.includes('fetch failed') || msg.includes('network') || msg.includes('dns'))
    return 'Could not reach the Anthropic API. Please check your connection and try again.';

  // Catch-all — include error class name for diagnostics without leaking secrets
  const errorType = error instanceof Error ? error.constructor.name : 'Unknown';
  return `Generation failed (${errorType}). Please try again or switch models.`;
}

export async function POST(request: NextRequest) {
  // ── Rate limiting ─────────────────────────────────────────
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';
  if (!isAllowed(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait a moment and try again.' }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
    );
  }

  try {
    const { text, params, apiKey } = (await request.json()) as {
      text: string;
      params: GenerationParams;
      apiKey: string;
    };

    // ── Input validation ──────────────────────────────────────
    if (!apiKey || typeof apiKey !== 'string') {
      return new Response(
        JSON.stringify({ error: 'A valid API key is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!text || typeof text !== 'string' || text.length > MAX_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Prompt text is required and must be under ${MAX_TEXT_LENGTH.toLocaleString()} characters` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!params || !VALID_MODEL_IDS.has(params.model)) {
      return new Response(
        JSON.stringify({ error: 'Invalid model selected' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!VALID_FORMAT_IDS.has(params.format)) {
      return new Response(
        JSON.stringify({ error: 'Invalid output format selected' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!VALID_EFFORTS.has(params.effort)) {
      return new Response(
        JSON.stringify({ error: 'Invalid effort level' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // ── Build meta-prompt and resolve model string ─────────────
    const client = new Anthropic({ apiKey });
    const { system, userPrefix } = buildMetaPrompt(params);

    // Look up the actual API model string from constants (validated above)
    const modelInfo = MODELS.find((m) => m.id === params.model)!;
    const modelString = modelInfo.apiString;

    // Cap max_tokens to the model's actual maximum (not the global 128K ceiling)
    const maxTokens = Math.min(
      Math.max(1, Math.floor(params.maxTokens)),
      modelInfo.maxOutputTokens
    );

    // ── Start streaming from the Anthropic API ────────────────
    const stream = await client.messages.stream({
      model: modelString,
      max_tokens: maxTokens,
      system,
      messages: [
        {
          role: 'user',
          content: `${userPrefix}\n\nUser's request:\n${text}`,
        },
      ],
    });

    // ── Convert the SDK stream to an SSE ReadableStream ───────
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const chunk = JSON.stringify({ text: event.delta.text });
              controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
            }
          }

          // Send final message with usage metadata
          const finalMessage = await stream.finalMessage();
          const doneChunk = JSON.stringify({
            done: true,
            usage: finalMessage.usage,
          });
          controller.enqueue(encoder.encode(`data: ${doneChunk}\n\n`));
          controller.close();
        } catch (streamError) {
          console.error('[generate] Stream error:', streamError);
          const errorChunk = JSON.stringify({
            error: sanitizeError(streamError),
          });
          try {
            controller.enqueue(encoder.encode(`data: ${errorChunk}\n\n`));
            controller.close();
          } catch {
            // Controller may already be closed if client disconnected
          }
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: sanitizeError(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
