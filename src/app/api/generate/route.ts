import { NextRequest } from 'next/server';
import { buildMetaPrompt } from '@/lib/engine/meta-prompt-builder';
import { resolveModelApiString } from '@/lib/engine/model-context';
import { FORMATS } from '@/lib/constants';
import { getProvider, createAnthropicAdapter, createOpenAICompatAdapter } from '@/lib/providers';
import type { GenerationParams } from '@/lib/types';
import type { ProviderAdapter } from '@/lib/providers';

export const runtime = 'nodejs';

// Allow up to 60 s on Vercel Hobby (default is only 10 s for Node.js functions).
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

// ── Adapter singletons (one per SDK type) ─────────────────────
const adapters: Record<string, ProviderAdapter> = {
  anthropic: createAnthropicAdapter(),
  'openai-compat': createOpenAICompatAdapter(),
};

// ── Validation constants ──────────────────────────────────────
const VALID_FORMAT_IDS = new Set(FORMATS.map((f) => f.id));
const VALID_EFFORTS = new Set(['low', 'medium', 'high', 'max']);
const MAX_TEXT_LENGTH = 50_000;

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

    // ── Resolve provider from registry ───────────────────────
    const provider = getProvider(params.provider);
    if (!provider) {
      return new Response(
        JSON.stringify({ error: 'Invalid provider selected' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Input validation ─────────────────────────────────────
    if (provider.requiresApiKey && (!apiKey || typeof apiKey !== 'string')) {
      return new Response(
        JSON.stringify({ error: `A valid API key is required for ${provider.name}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!text || typeof text !== 'string' || text.length > MAX_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Prompt text is required and must be under ${MAX_TEXT_LENGTH.toLocaleString()} characters` }),
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

    // ── Resolve model API string ─────────────────────────────
    // For custom models (Ollama custom, LM Studio, Custom provider),
    // use the customModelName provided by the user.
    const modelApiString = params.customModelName
      ? params.customModelName
      : resolveModelApiString(params.provider, params.model);

    if (!modelApiString) {
      return new Response(
        JSON.stringify({ error: 'No model specified. Please select or enter a model name.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Resolve max tokens (cap to model's maximum) ──────────
    const modelInfo = provider.models.find((m) => m.id === params.model);
    const modelMaxTokens = modelInfo?.maxOutputTokens ?? 16_384;
    const maxTokens = Math.min(
      Math.max(1, Math.floor(params.maxTokens)),
      modelMaxTokens
    );

    // ── Build meta-prompt ────────────────────────────────────
    const { system, userPrefix } = buildMetaPrompt(params);

    // ── Resolve base URL ─────────────────────────────────────
    const baseUrl = params.customBaseUrl || provider.defaultBaseUrl;

    // ── Get the right adapter ────────────────────────────────
    const adapter = adapters[provider.sdkType];
    if (!adapter) {
      return new Response(
        JSON.stringify({ error: `Unsupported SDK type: ${provider.sdkType}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Stream from the provider ─────────────────────────────
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const chunks = adapter.stream({
            apiKey: apiKey || '',
            model: modelApiString,
            system,
            userMessage: `${userPrefix}\n\nUser's request:\n${text}`,
            maxTokens,
            baseUrl,
          });

          for await (const chunk of chunks) {
            if (chunk.type === 'text' && chunk.text) {
              const data = JSON.stringify({ text: chunk.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            } else if (chunk.type === 'done') {
              const data = JSON.stringify({
                done: true,
                usage: chunk.usage,
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              controller.close();
              return;
            } else if (chunk.type === 'error') {
              const data = JSON.stringify({ error: chunk.error });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              controller.close();
              return;
            }
          }

          // If stream ends without a 'done' chunk, close cleanly
          controller.close();
        } catch (streamError) {
          console.error('[generate] Stream error:', streamError);
          const errorMsg = streamError instanceof Error
            ? streamError.message
            : 'Generation failed. Please try again.';
          try {
            const data = JSON.stringify({ error: errorMsg });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
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
    console.error('[generate] Request error:', error);
    const errorMsg = error instanceof Error
      ? error.message
      : 'Generation failed. Please try again.';
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
