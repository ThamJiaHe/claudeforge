import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildMetaPrompt } from '@/lib/engine/meta-prompt-builder';
import { MODELS } from '@/lib/constants';
import type { GenerationParams } from '@/lib/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { text, params, apiKey } = (await request.json()) as {
      text: string;
      params: GenerationParams;
      apiKey: string;
    };

    // ── Input validation ──────────────────────────────────────
    if (!apiKey || !text) {
      return new Response(
        JSON.stringify({ error: 'API key and prompt text are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Build meta-prompt and resolve model string ─────────────
    const client = new Anthropic({ apiKey });
    const { system, userPrefix } = buildMetaPrompt(params);

    // Look up the actual API model string from constants
    const modelInfo = MODELS.find((m) => m.id === params.model);
    const modelString = modelInfo?.apiString ?? params.model;

    // ── Start streaming from the Anthropic API ────────────────
    const stream = await client.messages.stream({
      model: modelString,
      max_tokens: params.maxTokens,
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
          const errorChunk = JSON.stringify({
            error: String(streamError),
          });
          controller.enqueue(encoder.encode(`data: ${errorChunk}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Generation failed: ${String(error)}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
