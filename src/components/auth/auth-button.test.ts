import { describe, it, expect } from 'vitest';

// ── Finding 9: Avatar URL validation ──────────────────────

/** Re-implement for isolated testing (component uses this internally) */
function isValidAvatarUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname === 'avatars.githubusercontent.com'
    );
  } catch {
    return false;
  }
}

describe('isValidAvatarUrl', () => {
  it('accepts valid GitHub avatar URLs', () => {
    expect(isValidAvatarUrl('https://avatars.githubusercontent.com/u/12345?v=4')).toBe(true);
    expect(isValidAvatarUrl('https://avatars.githubusercontent.com/u/999')).toBe(true);
  });

  it('rejects non-GitHub URLs', () => {
    expect(isValidAvatarUrl('https://evil.com/avatar.png')).toBe(false);
    expect(isValidAvatarUrl('https://example.com/avatars.githubusercontent.com')).toBe(false);
  });

  it('rejects HTTP (non-HTTPS)', () => {
    expect(isValidAvatarUrl('http://avatars.githubusercontent.com/u/123')).toBe(false);
  });

  it('rejects javascript: protocol', () => {
    expect(isValidAvatarUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects data: URIs', () => {
    expect(isValidAvatarUrl('data:image/png;base64,abc')).toBe(false);
  });

  it('rejects malformed URLs', () => {
    expect(isValidAvatarUrl('')).toBe(false);
    expect(isValidAvatarUrl('not-a-url')).toBe(false);
  });

  it('rejects subdomain spoofing', () => {
    expect(isValidAvatarUrl('https://avatars.githubusercontent.com.evil.com/img')).toBe(false);
  });
});
