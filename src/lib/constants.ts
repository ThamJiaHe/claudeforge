import type { ModelInfo, FormatInfo } from './types';

export const MODELS: ModelInfo[] = [
  {
    id: 'claude-opus-4-6',
    apiString: 'claude-opus-4-6',
    displayName: 'Claude Opus 4.6',
    description: 'Most powerful — adaptive thinking, 128K output, 1M context (beta)',
    supportsThinking: true,
    supportsAdaptiveThinking: true,
    supportsEffortMax: true,
    maxOutputTokens: 128_000,
    contextWindow: 200_000,
    inputPricePer1M: 5.0,
    outputPricePer1M: 25.0,
  },
  {
    id: 'claude-sonnet-4-6',
    apiString: 'claude-sonnet-4-6',
    displayName: 'Claude Sonnet 4.6',
    description: 'Best balance — adaptive thinking, 64K output, great value',
    supportsThinking: true,
    supportsAdaptiveThinking: true,
    supportsEffortMax: false,
    maxOutputTokens: 64_000,
    contextWindow: 200_000,
    inputPricePer1M: 3.0,
    outputPricePer1M: 15.0,
  },
  {
    id: 'claude-haiku-4-5',
    apiString: 'claude-haiku-4-5-20251001',
    displayName: 'Claude Haiku 4.5',
    description: 'Fastest — extended thinking, 64K output, cost-efficient',
    supportsThinking: true,
    supportsAdaptiveThinking: false,
    supportsEffortMax: false,
    maxOutputTokens: 64_000,
    contextWindow: 200_000,
    inputPricePer1M: 1.0,
    outputPricePer1M: 5.0,
  },
];

export const FORMATS: FormatInfo[] = [
  { id: 'xml', displayName: 'XML (Anthropic)', description: 'Official Anthropic prompt structure with XML tags', fileExtension: 'xml', syntaxLanguage: 'xml' },
  { id: 'toon', displayName: 'TOON', description: '[ROLE], [TASK], [OUTPUT] block format', fileExtension: 'txt', syntaxLanguage: 'markdown' },
  { id: 'harness', displayName: 'Harness Style', description: 'YAML-like structured prompts with metadata', fileExtension: 'yaml', syntaxLanguage: 'yaml' },
  { id: 'markdown', displayName: 'Markdown', description: 'Headers and bullets, human-readable', fileExtension: 'md', syntaxLanguage: 'markdown' },
  { id: 'plaintext', displayName: 'Plain Text', description: 'No formatting, raw prompt text', fileExtension: 'txt', syntaxLanguage: 'text' },
  { id: 'json', displayName: 'JSON', description: 'Machine-readable structured JSON', fileExtension: 'json', syntaxLanguage: 'json' },
  { id: 'yaml', displayName: 'YAML Config', description: 'Key-value config-file style', fileExtension: 'yaml', syntaxLanguage: 'yaml' },
  { id: 'claudemd', displayName: 'Claude.md', description: 'Claude Code project rules format', fileExtension: 'md', syntaxLanguage: 'markdown' },
  { id: 'system-user-split', displayName: 'System + User', description: 'Separate system and user message blocks', fileExtension: 'json', syntaxLanguage: 'json' },
];

export const DEFAULT_MODEL = 'claude-sonnet-4-6' as const;
export const DEFAULT_FORMAT = 'xml' as const;
export const DEFAULT_EFFORT = 'medium' as const;
export const DEFAULT_MAX_TOKENS = 4096;

export const APP_NAME = 'ClaudeForge';
export const APP_DESCRIPTION = 'Craft perfect Claude prompts from plain English';
export const APP_VERSION = '0.1.0';
