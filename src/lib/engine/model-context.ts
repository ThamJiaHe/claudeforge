import type { ClaudeModel } from '@/lib/types';
import { MODELS } from '@/lib/constants';

/**
 * Returns model-specific instructions that inform the meta-prompt builder
 * about the target model's capabilities, limitations, and best-use patterns.
 */
export function getModelContext(model: ClaudeModel): string {
  const modelInfo = MODELS.find((m) => m.id === model);

  if (!modelInfo) {
    throw new Error(`Unknown model: ${model}`);
  }

  switch (model) {
    case 'claude-opus-4-6':
      return [
        `Target model: ${modelInfo.displayName} (${modelInfo.apiString})`,
        '',
        'Capabilities:',
        '- Supports adaptive extended thinking (budget_tokens adjusts dynamically)',
        '- Maximum effort level ("max") for deepest reasoning',
        `- Up to ${modelInfo.maxOutputTokens.toLocaleString()} output tokens (128K) for very long responses`,
        `- ${modelInfo.contextWindow.toLocaleString()} token context window`,
        '- Best-in-class for complex, multi-step, and nuanced reasoning tasks',
        '',
        'Prompt guidance for this model:',
        '- Feel free to include detailed, multi-layered instructions',
        '- Complex chain-of-thought prompts work exceptionally well',
        '- Can handle large structured outputs (long code, comprehensive analyses)',
        '- Ideal for prompts that require balancing multiple constraints',
        '- Extended thinking allows the model to reason through ambiguity before responding',
      ].join('\n');

    case 'claude-sonnet-4-6':
      return [
        `Target model: ${modelInfo.displayName} (${modelInfo.apiString})`,
        '',
        'Capabilities:',
        '- Supports extended thinking with effort levels: low, medium, high (not max)',
        '- Near-Opus performance at lower cost',
        `- Up to ${modelInfo.maxOutputTokens.toLocaleString()} output tokens`,
        `- ${modelInfo.contextWindow.toLocaleString()} token context window`,
        '- Best general-purpose choice balancing quality and cost',
        '',
        'Prompt guidance for this model:',
        '- Well-structured prompts with clear instructions yield excellent results',
        '- Supports moderate complexity and multi-step reasoning',
        '- Good at following format specifications precisely',
        '- Effort levels let users trade speed for depth: low for quick tasks, high for careful work',
        '- Excellent cost-performance ratio for most prompt engineering tasks',
      ].join('\n');

    case 'claude-haiku-4-5':
      return [
        `Target model: ${modelInfo.displayName} (${modelInfo.apiString})`,
        '',
        'Capabilities:',
        '- Fastest model in the Claude family',
        '- Does NOT support extended thinking or effort levels',
        `- Up to ${modelInfo.maxOutputTokens.toLocaleString()} output tokens`,
        `- ${modelInfo.contextWindow.toLocaleString()} token context window`,
        '- Most cost-efficient option',
        '',
        'Prompt guidance for this model:',
        '- Keep prompts concise and focused on a single task',
        '- Avoid overly complex multi-step instructions',
        '- Direct, explicit instructions work best',
        '- Prefer shorter outputs; break large tasks into smaller calls',
        '- Best for simple prompt patterns: classification, extraction, reformatting',
        '- Do not include thinking/reasoning directives (model does not support them)',
      ].join('\n');

    default: {
      const _exhaustive: never = model;
      throw new Error(`Unhandled model: ${_exhaustive}`);
    }
  }
}
