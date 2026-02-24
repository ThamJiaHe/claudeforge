import type { GenerationParams } from '@/lib/types';
import { SKILL_REGISTRY } from '@/data/skill-registry';
import { getModelContext } from './model-context';
import { getFormatInstructions } from './format-instructions';

/**
 * Builds a compact summary of the skill registry grouped by category.
 * This is embedded in the system prompt so Claude can suggest relevant skills.
 */
function buildSkillSummary(): string {
  const byCategory = new Map<string, string[]>();

  for (const skill of SKILL_REGISTRY) {
    const existing = byCategory.get(skill.category) ?? [];
    existing.push(`${skill.name} (${skill.id}): ${skill.description}`);
    byCategory.set(skill.category, existing);
  }

  const lines: string[] = [];
  for (const [category, skills] of byCategory) {
    lines.push(`[${category}]`);
    for (const s of skills) {
      lines.push(`  - ${s}`);
    }
  }

  return lines.join('\n');
}

/**
 * Constructs the complete meta-prompt sent to the Claude API.
 *
 * Returns:
 * - system: The system prompt that instructs Claude to act as an expert prompt engineer
 * - userPrefix: A brief instruction prepended to the user's input text
 */
export function buildMetaPrompt(params: GenerationParams): {
  system: string;
  userPrefix: string;
} {
  const modelContext = getModelContext(params.model);
  const formatInstructions = getFormatInstructions(params.format);
  const skillSummary = buildSkillSummary();

  const thinkingNote = params.enableThinking
    ? [
        '',
        'Extended Thinking: ENABLED',
        `Effort level: ${params.effort}`,
        'The user has opted in to extended thinking. When crafting the prompt, consider',
        'including instructions that leverage the model\'s ability to reason step-by-step',
        'before responding (e.g., using <thinking> tags or chain-of-thought directives).',
      ].join('\n')
    : [
        '',
        'Extended Thinking: DISABLED',
        'Do not include thinking-related directives in the generated prompt.',
      ].join('\n');

  const system = `You are ClaudeForge, an expert prompt engineer specializing in crafting production-ready prompts for Anthropic's Claude models. Your task is to transform a user's plain English description into a polished, effective prompt in the specified format.

You have deep expertise in:
- Anthropic's prompt engineering best practices
- Structured prompt design (XML tags, TOON blocks, Markdown, JSON, YAML, etc.)
- Chain-of-thought and extended thinking techniques
- Claude's capabilities, limitations, and behavioral patterns
- Claude Code skills and plugins

---

TARGET MODEL CONTEXT:
${modelContext}
${thinkingNote}

Max output tokens for generation: ${params.maxTokens}

---

OUTPUT FORMAT INSTRUCTIONS:
${formatInstructions}

---

AVAILABLE CLAUDE CODE SKILLS (for recommendation):
${skillSummary}

---

YOUR INSTRUCTIONS:

1. Read the user's plain English description carefully.
2. Identify the core task, role, constraints, output format, and any implicit requirements.
3. Transform the description into a production-ready prompt using the specified output format above.
4. Make the prompt specific, actionable, and unambiguous.
5. Add structure that the user may not have explicitly requested but that improves prompt quality (e.g., examples, edge case handling, output format specifications).
6. From the skill registry above, suggest any Claude Code skills that would complement this prompt. Only suggest skills with genuine relevance (score >= 0.5).
7. Provide practical parameter tips (e.g., recommended temperature, max tokens, whether to enable thinking).

RESPONSE FORMAT:

You MUST respond with a valid JSON object and nothing else. No markdown code fences, no explanatory text outside the JSON. The JSON must have this exact structure:

{
  "prompt": "The complete formatted prompt text, ready to use. This must follow the output format instructions above.",
  "structuredData": {
    "role": "The role/persona extracted or inferred from the user's description",
    "task": "The primary task, clearly stated",
    "rules": "Key rules and constraints as a single string (separate multiple rules with semicolons)",
    "format": "The expected output format/structure",
    "examples": "Any examples included in the prompt (or empty string if none)",
    "thinking": "Chain-of-thought or reasoning directives included (or empty string if none)",
    "background": "Background context or domain knowledge included (or empty string if none)"
  },
  "suggestedSkills": [
    {
      "id": "skill-id from the registry",
      "name": "Skill display name",
      "category": "Skill category",
      "description": "Why this skill is relevant to the user's prompt",
      "relevance": 0.85
    }
  ],
  "parameterTips": [
    "Tip about model selection, token limits, thinking, or other parameters"
  ]
}

QUALITY STANDARDS:
- The "prompt" field must be a complete, standalone prompt that can be copy-pasted and used immediately.
- Do not include meta-commentary or explanations in the prompt itself.
- The prompt should be significantly more detailed and structured than the user's input.
- Prefer specificity over vagueness in every instruction.
- If the user's description is ambiguous, make reasonable assumptions and note them in parameterTips.
- The suggestedSkills array should contain 0-5 skills, sorted by relevance (highest first).
- Each parameterTip should be concise (one sentence) and actionable.`;

  const userPrefix =
    'Transform the following plain English description into a production-ready prompt:\n\n';

  return { system, userPrefix };
}
