import type { PromptFormat } from '@/lib/types';

/**
 * A mapping from structuredData keys to their display labels.
 * Order determines the rendering order within each format.
 */
const SECTION_LABELS: Record<string, string> = {
  role: 'Role',
  task: 'Task',
  rules: 'Rules',
  format: 'Output Format',
  examples: 'Examples',
  thinking: 'Thinking',
  background: 'Background',
};

/**
 * XML tag names corresponding to each structuredData key.
 */
const XML_TAG_NAMES: Record<string, string> = {
  role: 'role',
  task: 'task',
  rules: 'rules',
  format: 'output_format',
  examples: 'examples',
  thinking: 'thinking',
  background: 'background',
};

/**
 * TOON section headers corresponding to each structuredData key.
 */
const TOON_HEADERS: Record<string, string> = {
  role: 'ROLE',
  task: 'TASK',
  rules: 'RULES',
  format: 'OUTPUT',
  examples: 'EXAMPLES',
  thinking: 'THINKING',
  background: 'BACKGROUND',
};

/**
 * Returns an array of [key, value] pairs from structuredData,
 * filtered to only non-empty trimmed values, in a stable order.
 */
function getActiveSections(
  structuredData: Record<string, string>,
): [string, string][] {
  const orderedKeys = Object.keys(SECTION_LABELS);
  const result: [string, string][] = [];

  for (const key of orderedKeys) {
    const value = structuredData[key];
    if (value && value.trim().length > 0) {
      result.push([key, value.trim()]);
    }
  }

  // Include any extra keys not in SECTION_LABELS (future-proofing)
  for (const key of Object.keys(structuredData)) {
    if (!SECTION_LABELS[key]) {
      const value = structuredData[key];
      if (value && value.trim().length > 0) {
        result.push([key, value.trim()]);
      }
    }
  }

  return result;
}

/**
 * Escape a string for safe XML content (ampersand, angle brackets, quotes).
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─── Format Renderers ──────────────────────────────────────

function renderXml(sections: [string, string][]): string {
  if (sections.length === 0) return '<system_prompt>\n</system_prompt>';

  const inner = sections
    .map(([key, value]) => {
      const tag = XML_TAG_NAMES[key] ?? key;
      return `  <${tag}>${escapeXml(value)}</${tag}>`;
    })
    .join('\n');

  return `<system_prompt>\n${inner}\n</system_prompt>`;
}

function renderToon(sections: [string, string][]): string {
  if (sections.length === 0) return '';

  return sections
    .map(([key, value]) => {
      const header = TOON_HEADERS[key] ?? key.toUpperCase();
      return `[${header}]\n${value}`;
    })
    .join('\n\n');
}

function renderHarness(sections: [string, string][]): string {
  const data = Object.fromEntries(sections);

  const lines: string[] = [];
  lines.push('name: Generated Prompt');
  lines.push('description: ClaudeForge generated prompt');

  // Build system section from role + other non-task/rules fields
  const systemParts: string[] = [];
  if (data.role) systemParts.push(`Role: ${data.role}`);
  if (data.task) systemParts.push(`Task: ${data.task}`);
  if (data.background) systemParts.push(`Background: ${data.background}`);
  if (data.format) systemParts.push(`Output Format: ${data.format}`);
  if (data.thinking) systemParts.push(`Thinking: ${data.thinking}`);
  if (data.examples) systemParts.push(`Examples: ${data.examples}`);

  if (systemParts.length > 0) {
    lines.push('system: |');
    for (const part of systemParts) {
      lines.push(`  ${part}`);
    }
  }

  // User section
  if (data.task) {
    lines.push('user: |');
    lines.push(`  ${data.task}`);
  }

  // Constraints from rules
  if (data.rules) {
    const ruleLines = data.rules
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (ruleLines.length > 0) {
      lines.push('constraints:');
      for (const rule of ruleLines) {
        lines.push(`  - ${rule}`);
      }
    }
  }

  return lines.join('\n');
}

function renderMarkdown(sections: [string, string][]): string {
  if (sections.length === 0) return '';

  return sections
    .map(([key, value], index) => {
      const label = SECTION_LABELS[key] ?? key;
      const heading = index === 0 ? `# ${label}` : `## ${label}`;
      return `${heading}\n${value}`;
    })
    .join('\n\n');
}

function renderPlaintext(sections: [string, string][]): string {
  if (sections.length === 0) return '';

  return sections
    .map(([key, value]) => {
      const label = SECTION_LABELS[key] ?? key;
      return `${label}:\n${value}`;
    })
    .join('\n\n');
}

function renderJson(sections: [string, string][]): string {
  const obj: Record<string, string> = {};
  for (const [key, value] of sections) {
    obj[key] = value;
  }
  return JSON.stringify(obj, null, 2);
}

function renderYaml(sections: [string, string][]): string {
  if (sections.length === 0) return '';

  return sections
    .map(([key, value]) => {
      // Use block scalar (|) for multi-line values, plain for single-line
      if (value.includes('\n')) {
        const indented = value
          .split('\n')
          .map((line) => `  ${line}`)
          .join('\n');
        return `${key}: |\n${indented}`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');
}

function renderClaudeMd(sections: [string, string][]): string {
  if (sections.length === 0) return '';

  return sections
    .map(([key, value], index) => {
      const label = SECTION_LABELS[key] ?? key;
      const heading = index === 0 ? `# ${label}` : `## ${label}`;
      return `${heading}\n\n${value}`;
    })
    .join('\n\n');
}

function renderSystemUserSplit(sections: [string, string][]): string {
  const data = Object.fromEntries(sections);

  // System = role + rules + background + format + thinking + examples
  const systemParts: string[] = [];
  if (data.role) systemParts.push(data.role);
  if (data.rules) systemParts.push(data.rules);
  if (data.background) systemParts.push(data.background);
  if (data.format) systemParts.push(data.format);
  if (data.thinking) systemParts.push(data.thinking);
  if (data.examples) systemParts.push(data.examples);

  const result: Record<string, string> = {
    system: systemParts.join('\n\n'),
    user: data.task ?? '',
  };

  return JSON.stringify(result, null, 2);
}

// ─── Main Export ────────────────────────────────────────────

/**
 * Convert structured prompt data into the specified output format.
 *
 * This is a pure client-side function. It takes the structuredData
 * returned from the API (keys like role, task, rules, format,
 * examples, thinking, background) and renders it in the target format.
 *
 * @param structuredData - Key-value pairs of prompt sections (all values are strings)
 * @param targetFormat - One of the 9 supported PromptFormat values
 * @returns The formatted prompt string
 */
export function convertFormat(
  structuredData: Record<string, string>,
  targetFormat: PromptFormat,
): string {
  const sections = getActiveSections(structuredData);

  switch (targetFormat) {
    case 'xml':
      return renderXml(sections);
    case 'toon':
      return renderToon(sections);
    case 'harness':
      return renderHarness(sections);
    case 'markdown':
      return renderMarkdown(sections);
    case 'plaintext':
      return renderPlaintext(sections);
    case 'json':
      return renderJson(sections);
    case 'yaml':
      return renderYaml(sections);
    case 'claudemd':
      return renderClaudeMd(sections);
    case 'system-user-split':
      return renderSystemUserSplit(sections);
    default: {
      // Exhaustiveness check
      const _exhaustive: never = targetFormat;
      throw new Error(`Unknown format: ${_exhaustive}`);
    }
  }
}
