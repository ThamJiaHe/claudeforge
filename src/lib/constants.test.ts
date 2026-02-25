import { describe, it, expect } from 'vitest';
import { PROVIDERS, FORMATS, isValidFormat, isValidProviderModel } from './constants';

// ── Provider & Model validation ─────────────────────────

describe('isValidProviderModel', () => {
  it('accepts valid provider-model combinations', () => {
    for (const p of PROVIDERS) {
      for (const m of p.models) {
        expect(isValidProviderModel(p.id, m.id)).toBe(true);
      }
    }
  });

  it('rejects unknown model for a valid provider', () => {
    expect(isValidProviderModel('anthropic', 'gpt-4o')).toBe(false);
    expect(isValidProviderModel('openai', 'claude-sonnet-4-6')).toBe(false);
  });

  it('rejects unknown provider', () => {
    expect(isValidProviderModel('nonexistent', 'anything')).toBe(false);
  });
});

describe('isValidFormat', () => {
  it('accepts all defined format IDs', () => {
    for (const f of FORMATS) {
      expect(isValidFormat(f.id)).toBe(true);
    }
  });

  it('rejects unknown format strings', () => {
    expect(isValidFormat('html')).toBe(false);
    expect(isValidFormat('')).toBe(false);
    expect(isValidFormat('XML')).toBe(false); // case-sensitive
  });
});

describe('PROVIDERS array integrity', () => {
  it('has unique provider IDs', () => {
    const ids = PROVIDERS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each provider has at least one model', () => {
    for (const p of PROVIDERS) {
      expect(p.models.length).toBeGreaterThan(0);
    }
  });

  it('all models within a provider have unique IDs', () => {
    for (const p of PROVIDERS) {
      const ids = p.models.map((m) => m.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('all models have valid maxOutputTokens', () => {
    for (const p of PROVIDERS) {
      for (const m of p.models) {
        expect(m.maxOutputTokens).toBeGreaterThan(0);
      }
    }
  });
});

describe('FORMATS array integrity', () => {
  it('has unique IDs', () => {
    const ids = FORMATS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
