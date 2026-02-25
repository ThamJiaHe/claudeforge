import OpenAI from 'openai';
import type { ProviderAdapter, StreamChunk } from './types';

function sanitizeOpenAIError(error: unknown): string {
  console.error('[openai-compat-adapter] API error:', error);

  if (error instanceof OpenAI.AuthenticationError) return 'Invalid API key. Please check your API key.';
  if (error instanceof OpenAI.RateLimitError) return 'Rate limit exceeded. Please wait and try again.';
  if (error instanceof OpenAI.PermissionDeniedError) return 'Your API key does not have permission for this model.';
  if (error instanceof OpenAI.NotFoundError) return 'Model not found. Please check the model name.';
  if (error instanceof OpenAI.BadRequestError) return `Invalid request: ${error.message}`;
  if (error instanceof OpenAI.InternalServerError) return 'Provider API server error. Please retry.';
  if (error instanceof OpenAI.APIConnectionError) return 'Could not reach the provider API. Check the base URL.';
  if (error instanceof OpenAI.APIError) return `API error (${error.status ?? 'unknown'})`;

  const msg = String(error).toLowerCase();
  if (msg.includes('econnrefused')) return 'Connection refused. Is the local server running?';
  if (msg.includes('timeout') || msg.includes('aborted')) return 'Request timed out.';
  if (msg.includes('fetch failed') || msg.includes('network')) return 'Could not reach the provider. Check your connection.';
  return 'Generation failed. Please try again.';
}

export function createOpenAICompatAdapter(): ProviderAdapter {
  return {
    async *stream({ apiKey, model, system, userMessage, maxTokens, baseUrl }) {
      const client = new OpenAI({
        apiKey: apiKey || 'not-needed',
        baseURL: baseUrl,
      });

      try {
        const stream = await client.chat.completions.create({
          model,
          max_tokens: maxTokens,
          stream: true,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: userMessage },
          ],
        });

        let inputTokens = 0;
        let outputTokens = 0;

        for await (const chunk of stream) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) {
            yield { type: 'text', text: delta } satisfies StreamChunk;
          }
          if (chunk.usage) {
            inputTokens = chunk.usage.prompt_tokens ?? 0;
            outputTokens = chunk.usage.completion_tokens ?? 0;
          }
        }

        yield {
          type: 'done',
          usage: { input_tokens: inputTokens, output_tokens: outputTokens },
        } satisfies StreamChunk;
      } catch (err) {
        yield { type: 'error', error: sanitizeOpenAIError(err) } satisfies StreamChunk;
      }
    },
  };
}
