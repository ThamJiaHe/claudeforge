import { describe, it, expect } from 'vitest';
import { convertFormat } from '@/lib/engine/format-converter';
import type { PromptFormat } from '@/lib/types';

// ─── Test Fixtures ─────────────────────────────────────────

const fullData: Record<string, string> = {
  role: 'You are an expert TypeScript developer.',
  task: 'Refactor the authentication module to use JWT tokens.',
  rules: 'Follow SOLID principles.\nWrite unit tests for all public methods.\nUse async/await instead of callbacks.',
  format: 'Return the refactored code in a single TypeScript file.',
  examples: 'Input: old auth module\nOutput: refactored auth module with JWT',
};

const minimalData: Record<string, string> = {
  task: 'Summarize the document.',
};

const emptyData: Record<string, string> = {};

const dataWithThinkingAndBackground: Record<string, string> = {
  role: 'You are a data analyst.',
  task: 'Analyze the sales data.',
  thinking: 'Consider seasonal trends and outliers.',
  background: 'The company sells widgets in North America.',
};

const ALL_FORMATS: PromptFormat[] = [
  'xml',
  'toon',
  'harness',
  'markdown',
  'plaintext',
  'json',
  'yaml',
  'claudemd',
  'system-user-split',
];

// ─── Tests: All Formats Produce Output ─────────────────────

describe('convertFormat', () => {
  describe('produces non-empty output for full data', () => {
    for (const format of ALL_FORMATS) {
      it(`${format}: produces non-empty string`, () => {
        const result = convertFormat(fullData, format);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    }
  });

  describe('handles empty structuredData gracefully', () => {
    for (const format of ALL_FORMATS) {
      it(`${format}: does not throw on empty data`, () => {
        expect(() => convertFormat(emptyData, format)).not.toThrow();
      });
    }
  });

  describe('handles minimal data (only task)', () => {
    for (const format of ALL_FORMATS) {
      it(`${format}: produces output with just a task`, () => {
        const result = convertFormat(minimalData, format);
        expect(result).toBeTruthy();
        expect(result).toContain('Summarize the document');
      });
    }
  });

  // ─── XML Format ────────────────────────────────────────

  describe('xml format', () => {
    it('wraps content in <system_prompt> tags', () => {
      const result = convertFormat(fullData, 'xml');
      expect(result).toMatch(/^<system_prompt>/);
      expect(result).toMatch(/<\/system_prompt>$/);
    });

    it('creates correct XML tags for each section', () => {
      const result = convertFormat(fullData, 'xml');
      expect(result).toContain('<role>');
      expect(result).toContain('</role>');
      expect(result).toContain('<task>');
      expect(result).toContain('</task>');
      expect(result).toContain('<rules>');
      expect(result).toContain('</rules>');
      expect(result).toContain('<output_format>');
      expect(result).toContain('</output_format>');
      expect(result).toContain('<examples>');
      expect(result).toContain('</examples>');
    });

    it('escapes special XML characters', () => {
      const data = { role: 'Handle <html> & "quotes"' };
      const result = convertFormat(data, 'xml');
      expect(result).toContain('&lt;html&gt;');
      expect(result).toContain('&amp;');
      expect(result).toContain('&quot;quotes&quot;');
    });

    it('omits sections with empty values', () => {
      const result = convertFormat(minimalData, 'xml');
      expect(result).not.toContain('<role>');
      expect(result).toContain('<task>');
    });

    it('returns wrapper tags for empty data', () => {
      const result = convertFormat(emptyData, 'xml');
      expect(result).toBe('<system_prompt>\n</system_prompt>');
    });
  });

  // ─── TOON Format ───────────────────────────────────────

  describe('toon format', () => {
    it('uses bracket headers', () => {
      const result = convertFormat(fullData, 'toon');
      expect(result).toContain('[ROLE]');
      expect(result).toContain('[TASK]');
      expect(result).toContain('[RULES]');
      expect(result).toContain('[OUTPUT]');
      expect(result).toContain('[EXAMPLES]');
    });

    it('separates sections with double newlines', () => {
      const result = convertFormat(fullData, 'toon');
      expect(result).toContain('[ROLE]\nYou are an expert TypeScript developer.\n\n[TASK]');
    });

    it('omits sections for missing keys', () => {
      const result = convertFormat(minimalData, 'toon');
      expect(result).not.toContain('[ROLE]');
      expect(result).toContain('[TASK]');
    });

    it('returns empty string for empty data', () => {
      const result = convertFormat(emptyData, 'toon');
      expect(result).toBe('');
    });
  });

  // ─── Harness Format ────────────────────────────────────

  describe('harness format', () => {
    it('includes name and description headers', () => {
      const result = convertFormat(fullData, 'harness');
      expect(result).toContain('name: Generated Prompt');
      expect(result).toContain('description: ClaudeForge generated prompt');
    });

    it('includes system section with role and task', () => {
      const result = convertFormat(fullData, 'harness');
      expect(result).toContain('system: |');
      expect(result).toContain('  Role: You are an expert TypeScript developer.');
      expect(result).toContain('  Task: Refactor the authentication module');
    });

    it('includes user section with task', () => {
      const result = convertFormat(fullData, 'harness');
      expect(result).toContain('user: |');
    });

    it('splits rules into constraints list', () => {
      const result = convertFormat(fullData, 'harness');
      expect(result).toContain('constraints:');
      expect(result).toContain('  - Follow SOLID principles.');
      expect(result).toContain('  - Write unit tests for all public methods.');
      expect(result).toContain('  - Use async/await instead of callbacks.');
    });

    it('still has headers for empty data', () => {
      const result = convertFormat(emptyData, 'harness');
      expect(result).toContain('name: Generated Prompt');
      expect(result).toContain('description: ClaudeForge generated prompt');
    });
  });

  // ─── Markdown Format ───────────────────────────────────

  describe('markdown format', () => {
    it('uses # for first section and ## for subsequent', () => {
      const result = convertFormat(fullData, 'markdown');
      expect(result).toMatch(/^# Role/);
      expect(result).toContain('## Task');
      expect(result).toContain('## Rules');
    });

    it('includes section content after headings', () => {
      const result = convertFormat(fullData, 'markdown');
      expect(result).toContain('# Role\nYou are an expert TypeScript developer.');
    });

    it('omits missing sections', () => {
      const result = convertFormat(minimalData, 'markdown');
      expect(result).not.toContain('# Role');
      expect(result).toContain('# Task');
    });

    it('returns empty string for empty data', () => {
      const result = convertFormat(emptyData, 'markdown');
      expect(result).toBe('');
    });
  });

  // ─── Plain Text Format ─────────────────────────────────

  describe('plaintext format', () => {
    it('prefixes each section with its label and colon', () => {
      const result = convertFormat(fullData, 'plaintext');
      expect(result).toContain('Role:\nYou are an expert TypeScript developer.');
      expect(result).toContain('Task:\nRefactor the authentication module');
    });

    it('separates sections with double newlines', () => {
      const result = convertFormat(fullData, 'plaintext');
      // Check that sections are separated
      expect(result).toContain('developer.\n\nTask:');
    });

    it('returns empty string for empty data', () => {
      const result = convertFormat(emptyData, 'plaintext');
      expect(result).toBe('');
    });
  });

  // ─── JSON Format ───────────────────────────────────────

  describe('json format', () => {
    it('produces valid JSON', () => {
      const result = convertFormat(fullData, 'json');
      expect(() => JSON.parse(result)).not.toThrow();
    });

    it('includes all provided keys', () => {
      const result = convertFormat(fullData, 'json');
      const parsed = JSON.parse(result);
      expect(parsed.role).toBe('You are an expert TypeScript developer.');
      expect(parsed.task).toBe('Refactor the authentication module to use JWT tokens.');
      expect(parsed.rules).toContain('Follow SOLID principles.');
    });

    it('omits empty keys', () => {
      const result = convertFormat(minimalData, 'json');
      const parsed = JSON.parse(result);
      expect(parsed.task).toBe('Summarize the document.');
      expect(parsed.role).toBeUndefined();
    });

    it('produces empty JSON object for empty data', () => {
      const result = convertFormat(emptyData, 'json');
      const parsed = JSON.parse(result);
      expect(Object.keys(parsed)).toHaveLength(0);
    });
  });

  // ─── YAML Format ───────────────────────────────────────

  describe('yaml format', () => {
    it('uses key: value format for single-line values', () => {
      const data = { role: 'A helpful assistant' };
      const result = convertFormat(data, 'yaml');
      expect(result).toBe('role: A helpful assistant');
    });

    it('uses block scalar for multi-line values', () => {
      const result = convertFormat(fullData, 'yaml');
      expect(result).toContain('rules: |');
    });

    it('returns empty string for empty data', () => {
      const result = convertFormat(emptyData, 'yaml');
      expect(result).toBe('');
    });
  });

  // ─── Claude.md Format ──────────────────────────────────

  describe('claudemd format', () => {
    it('uses # for first section and ## for subsequent with blank line before content', () => {
      const result = convertFormat(fullData, 'claudemd');
      expect(result).toMatch(/^# Role\n\nYou are an expert TypeScript developer\./);
      expect(result).toContain('## Task\n\nRefactor the authentication module');
    });

    it('separates sections with double newlines', () => {
      const result = convertFormat(fullData, 'claudemd');
      // Two sections should be separated by \n\n
      expect(result).toContain('developer.\n\n## Task');
    });

    it('returns empty string for empty data', () => {
      const result = convertFormat(emptyData, 'claudemd');
      expect(result).toBe('');
    });
  });

  // ─── System + User Split Format ────────────────────────

  describe('system-user-split format', () => {
    it('produces valid JSON with system and user keys', () => {
      const result = convertFormat(fullData, 'system-user-split');
      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty('system');
      expect(parsed).toHaveProperty('user');
    });

    it('puts role and rules in system', () => {
      const result = convertFormat(fullData, 'system-user-split');
      const parsed = JSON.parse(result);
      expect(parsed.system).toContain('You are an expert TypeScript developer.');
      expect(parsed.system).toContain('Follow SOLID principles.');
    });

    it('puts task in user', () => {
      const result = convertFormat(fullData, 'system-user-split');
      const parsed = JSON.parse(result);
      expect(parsed.user).toBe('Refactor the authentication module to use JWT tokens.');
    });

    it('handles data with only task', () => {
      const result = convertFormat(minimalData, 'system-user-split');
      const parsed = JSON.parse(result);
      expect(parsed.user).toBe('Summarize the document.');
      expect(parsed.system).toBe('');
    });

    it('handles empty data', () => {
      const result = convertFormat(emptyData, 'system-user-split');
      const parsed = JSON.parse(result);
      expect(parsed.system).toBe('');
      expect(parsed.user).toBe('');
    });
  });

  // ─── Thinking and Background Keys ──────────────────────

  describe('thinking and background keys', () => {
    it('xml: includes thinking and background tags', () => {
      const result = convertFormat(dataWithThinkingAndBackground, 'xml');
      expect(result).toContain('<thinking>');
      expect(result).toContain('<background>');
    });

    it('toon: includes thinking and background headers', () => {
      const result = convertFormat(dataWithThinkingAndBackground, 'toon');
      expect(result).toContain('[THINKING]');
      expect(result).toContain('[BACKGROUND]');
    });

    it('json: includes thinking and background keys', () => {
      const result = convertFormat(dataWithThinkingAndBackground, 'json');
      const parsed = JSON.parse(result);
      expect(parsed.thinking).toBe('Consider seasonal trends and outliers.');
      expect(parsed.background).toBe('The company sells widgets in North America.');
    });

    it('system-user-split: includes background and thinking in system', () => {
      const result = convertFormat(dataWithThinkingAndBackground, 'system-user-split');
      const parsed = JSON.parse(result);
      expect(parsed.system).toContain('Consider seasonal trends and outliers.');
      expect(parsed.system).toContain('The company sells widgets in North America.');
    });
  });

  // ─── Whitespace Handling ───────────────────────────────

  describe('whitespace handling', () => {
    it('trims whitespace from values', () => {
      const data = { role: '  spaced out  ', task: '\ntabbed\n' };
      const result = convertFormat(data, 'json');
      const parsed = JSON.parse(result);
      expect(parsed.role).toBe('spaced out');
      expect(parsed.task).toBe('tabbed');
    });

    it('skips keys with whitespace-only values', () => {
      const data = { role: '   ', task: 'Real task' };
      const result = convertFormat(data, 'json');
      const parsed = JSON.parse(result);
      expect(parsed.role).toBeUndefined();
      expect(parsed.task).toBe('Real task');
    });
  });
});
