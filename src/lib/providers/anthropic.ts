import Anthropic from '@anthropic-ai/sdk';
import type { ProviderAdapter, StreamChunk } from './types';

/** Sanitise Anthropic SDK errors — no API keys leak to client */
function sanitizeAnthropicError(error: unknown): string {
  console.error('[anthropic-adapter] API error:', error);

  if (error instanceof Anthropic.AuthenticationError) return 'Invalid API key. Please check your Anthropic API key.';
  if (error instanceof Anthropic.RateLimitError) return 'Rate limit exceeded. Please wait and try again.';
  if (error instanceof Anthropic.PermissionDeniedError) return 'Your API key does not have permission to use this model.';
  if (error instanceof Anthropic.NotFoundError) return 'Model not found. Please choose a supported Claude model.';
  if (error instanceof Anthropic.BadRequestError) {
    const m = error.message.match(/"message"\s*:\s*"([^"]+)"/);
    return `Invalid request: ${m?.[1] ?? error.message}`;
  }
  if (error instanceof Anthropic.InternalServerError) return 'Anthropic API server error. Please retry.';
  if (error instanceof Anthropic.APIConnectionError) return 'Could not reach the Anthropic API.';
  if (error instanceof Anthropic.APIError) return `API error (${error.status ?? 'unknown'})`;

  const msg = String(error).toLowerCase();
  if (msg.includes('overloaded') || msg.includes('529')) return 'Anthropic API is temporarily overloaded.';
  if (msg.includes('timeout') || msg.includes('aborted')) return 'Request timed out.';
  if (msg.includes('econnrefused') || msg.includes('fetch failed')) return 'Could not reach the Anthropic API.';
  return 'Generation failed. Please try again.';
}

export function createAnthropicAdapter(): ProviderAdapter {
  return {
    async *stream({ apiKey, model, system, userMessage, maxTokens }) {
      const client = new Anthropic({ apiKey });

      try {
        const stream = await client.messages.stream({
          model,
          max_tokens: maxTokens,
          system,
          messages: [{ role: 'user', content: userMessage }],
        });

        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            yield { type: 'text', text: event.delta.text } satisfies StreamChunk;
          }
        }

        const final = await stream.finalMessage();
        yield {
          type: 'done',
          usage: final.usage,
        } satisfies StreamChunk;
      } catch (err) {
        yield { type: 'error', error: sanitizeAnthropicError(err) } satisfies StreamChunk;
      }
    },
  };
}
