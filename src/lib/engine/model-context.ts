import type { TargetId } from '@/lib/types';
import { getProvider } from '@/lib/providers';

/**
 * Returns target-aware model context that informs the meta-prompt builder
 * about what kind of model the generated prompt is optimized for.
 *
 * The "target" is the model family the user wants the generated prompt to
 * work best with — it may differ from the provider actually running the generation.
 */
export function getModelContext(target: TargetId, providerModelId?: string): string {
  // Try to look up display info from the provider registry
  const modelLabel = providerModelId || 'the selected model';

  switch (target) {
    case 'claude':
      return [
        `Target model family: Anthropic Claude`,
        `Generator model: ${modelLabel}`,
        '',
        'Optimize the generated prompt for Claude models (Opus, Sonnet, Haiku):',
        '- Use XML tags for structured sections (<role>, <task>, <rules>, <output_format>)',
        '- Leverage Claude\'s strong instruction-following and system prompt adherence',
        '- Support extended thinking / chain-of-thought via <thinking> tags when applicable',
        '- Claude excels at nuanced multi-step reasoning and careful constraint following',
        '- Prefer explicit structure; Claude responds well to clear formatting',
        '- Claude Code skills and .claude.md project rules are Claude-specific features',
      ].join('\n');

    case 'gpt':
      return [
        `Target model family: OpenAI GPT`,
        `Generator model: ${modelLabel}`,
        '',
        'Optimize the generated prompt for GPT models (GPT-4o, GPT-4o Mini, o3):',
        '- Use clear markdown headings and numbered lists for structure',
        '- GPT models respond well to role-playing ("You are a...")',
        '- System messages are strongly followed; place key constraints there',
        '- Use explicit formatting instructions (JSON mode, function calling hints)',
        '- GPT handles conversational tone well — less formal prompts can work',
        '- For o-series reasoning models, encourage step-by-step thinking',
      ].join('\n');

    case 'gemini':
      return [
        `Target model family: Google Gemini`,
        `Generator model: ${modelLabel}`,
        '',
        'Optimize the generated prompt for Gemini models (2.5 Pro, 2.5 Flash, 2.5 Flash Lite):',
        '- Gemini has a massive context window (1M+ tokens) — use that advantage',
        '- Structured prompts with clear sections work well',
        '- Gemini excels at multimodal tasks — mention image/video handling if relevant',
        '- Use clear, direct instructions; Gemini follows detailed specifications well',
        '- Gemini 2.5 Pro supports thinking/reasoning; include chain-of-thought directives',
        '- Flash models prioritize speed — keep prompts focused and concise',
      ].join('\n');

    case 'llama':
      return [
        `Target model family: Meta Llama (open-source)`,
        `Generator model: ${modelLabel}`,
        '',
        'Optimize the generated prompt for Llama models (Llama 3.3, Qwen, etc.):',
        '- Keep prompts clear and direct — open-source models benefit from simplicity',
        '- Use system prompts to set behavior, but keep them concise',
        '- Avoid overly complex nested structures; prefer flat, sequential instructions',
        '- Token limits may be lower — be economical with prompt length',
        '- Explicitly state the desired output format (JSON, list, etc.)',
        '- Local models may have less world knowledge — provide necessary context inline',
      ].join('\n');

    case 'universal':
      return [
        `Target: Universal (any model)`,
        `Generator model: ${modelLabel}`,
        '',
        'Create a prompt that works well across different AI models:',
        '- Use clear markdown structure that all models handle well',
        '- Avoid model-specific features (XML tags, function calling, etc.)',
        '- Be explicit about the desired output format and constraints',
        '- Use role descriptions ("You are...") which work universally',
        '- Include examples when possible — few-shot learning works across all models',
        '- Keep instructions direct and unambiguous',
        '- Avoid assumptions about model capabilities or context window size',
      ].join('\n');

    default: {
      // Fallback for any unrecognized target
      return [
        `Target: ${target}`,
        `Generator model: ${modelLabel}`,
        '',
        'Create a clear, well-structured prompt following general best practices.',
      ].join('\n');
    }
  }
}

/**
 * Resolve the API model string from a provider ID + model ID.
 * Returns the model's apiString from the registry, or the raw modelId as fallback.
 */
export function resolveModelApiString(providerId: string, modelId: string): string {
  const provider = getProvider(providerId);
  if (!provider) return modelId;
  const model = provider.models.find((m) => m.id === modelId);
  return model?.apiString || modelId;
}
