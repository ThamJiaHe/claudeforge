import { describe, it, expect } from 'vitest';
import { MODELS, FORMATS, isValidModel, isValidFormat } from './constants';

// ── Finding 12: Runtime type guards ───────────────────────

describe('isValidModel', () => {
  it('accepts all defined model IDs', () => {
    for (const m of MODELS) {
      expect(isValidModel(m.id)).toBe(true);
    }
  });

  it('rejects unknown model strings', () => {
    expect(isValidModel('gpt-4')).toBe(false);
    expect(isValidModel('')).toBe(false);
    expect(isValidModel('claude-sonnet-4-6-FAKE')).toBe(false);
  });

  it('rejects non-string-like values coerced to string', () => {
    expect(isValidModel('undefined')).toBe(false);
    expect(isValidModel('null')).toBe(false);
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

describe('MODELS array integrity', () => {
  it('has unique IDs', () => {
    const ids = MODELS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all models have valid apiString', () => {
    for (const m of MODELS) {
      expect(m.apiString).toBeTruthy();
      expect(typeof m.apiString).toBe('string');
    }
  });
});

describe('FORMATS array integrity', () => {
  it('has unique IDs', () => {
    const ids = FORMATS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
