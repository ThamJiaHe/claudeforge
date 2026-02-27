import type { FormatInfo, ProviderId, TargetId } from './types';
import { PROVIDERS, TARGETS, getProvider, isValidProviderModel } from './providers';

// ─── Re-export provider data for backward compatibility ──
export { PROVIDERS, TARGETS, getProvider, isValidProviderModel };

// ─── Formats ─────────────────────────────────────────────
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

// ─── Defaults ────────────────────────────────────────────
export const DEFAULT_PROVIDER: ProviderId = 'anthropic';
export const DEFAULT_MODEL = 'claude-sonnet-4-6';
export const DEFAULT_TARGET: TargetId = 'claude';
export const DEFAULT_FORMAT = 'xml' as const;
export const DEFAULT_EFFORT = 'medium' as const;
export const DEFAULT_MAX_TOKENS = 4096;

// ─── Runtime type guards ─────────────────────────────────
export function isValidFormat(value: string): value is import('./types').PromptFormat {
  return FORMATS.some((f) => f.id === value);
}

// ─── App metadata ────────────────────────────────────────
export const APP_NAME = 'ClaudeForge';
export const APP_DESCRIPTION = 'Craft perfect AI prompts from plain English';
export const APP_VERSION = '0.3.0';
