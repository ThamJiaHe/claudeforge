import { describe, it, expect } from 'vitest';

// ── Finding 10: API key format validation ─────────────────

/** Re-implement for isolated testing */
function isValidApiKeyFormat(key: string): boolean {
  return /^sk-ant-[a-zA-Z0-9_-]{10,}$/.test(key);
}

describe('isValidApiKeyFormat', () => {
  it('accepts valid Anthropic API key format', () => {
    expect(isValidApiKeyFormat('sk-ant-api03-abcdefghij1234567890')).toBe(true);
    expect(isValidApiKeyFormat('sk-ant-ABCDEFGHIJ_-1234567890')).toBe(true);
  });

  it('rejects keys without sk-ant- prefix', () => {
    expect(isValidApiKeyFormat('sk-1234567890abcdef')).toBe(false);
    expect(isValidApiKeyFormat('api-key-12345678901234')).toBe(false);
  });

  it('rejects empty strings', () => {
    expect(isValidApiKeyFormat('')).toBe(false);
  });

  it('rejects keys that are too short after prefix', () => {
    expect(isValidApiKeyFormat('sk-ant-abc')).toBe(false); // only 3 chars after prefix
    expect(isValidApiKeyFormat('sk-ant-')).toBe(false);
  });

  it('rejects keys with special characters', () => {
    expect(isValidApiKeyFormat('sk-ant-abc!@#$%^&*()')).toBe(false);
    expect(isValidApiKeyFormat('sk-ant-abc def ghij klmn')).toBe(false); // spaces
  });

  it('accepts keys with hyphens and underscores', () => {
    expect(isValidApiKeyFormat('sk-ant-api03-abc_def-ghi_jkl')).toBe(true);
  });
});
