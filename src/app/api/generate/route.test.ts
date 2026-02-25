import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Test the rate limiter logic extracted from route.ts.
 * We re-implement the pure function here to test it in isolation
 * (Edge Runtime route handlers can't be imported directly in vitest).
 */

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 20;
const ipLog = new Map<string, number[]>();

function isAllowed(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;

  let timestamps = ipLog.get(ip) ?? [];
  timestamps = timestamps.filter((t) => t > cutoff);

  if (timestamps.length >= RATE_MAX_REQUESTS) {
    ipLog.set(ip, timestamps);
    return false;
  }

  timestamps.push(now);
  ipLog.set(ip, timestamps);
  return true;
}

// ── Finding 5: Rate limiting ──────────────────────────────

describe('rate limiter', () => {
  beforeEach(() => {
    ipLog.clear();
  });

  it('allows requests under the limit', () => {
    for (let i = 0; i < RATE_MAX_REQUESTS; i++) {
      expect(isAllowed('1.2.3.4')).toBe(true);
    }
  });

  it('blocks requests over the limit', () => {
    for (let i = 0; i < RATE_MAX_REQUESTS; i++) {
      isAllowed('1.2.3.4');
    }
    expect(isAllowed('1.2.3.4')).toBe(false);
  });

  it('tracks IPs independently', () => {
    for (let i = 0; i < RATE_MAX_REQUESTS; i++) {
      isAllowed('1.2.3.4');
    }
    // Different IP should still be allowed
    expect(isAllowed('5.6.7.8')).toBe(true);
  });

  it('rejects 21st request from same IP', () => {
    for (let i = 0; i < 20; i++) {
      expect(isAllowed('10.0.0.1')).toBe(true);
    }
    expect(isAllowed('10.0.0.1')).toBe(false);
    expect(isAllowed('10.0.0.1')).toBe(false);
  });
});

// ── Finding 7 (already fixed): Error sanitization ────────

describe('sanitizeError', () => {
  // Re-implement for testing (mirrors route.ts sanitizeError without console.error)
  function sanitizeError(error: unknown): string {
    const msg = String(error).toLowerCase();

    if (msg.includes('authentication') || msg.includes('401') || msg.includes('invalid x-api-key') || msg.includes('invalid_api_key'))
      return 'Invalid API key. Please check your Anthropic API key.';
    if (msg.includes('rate_limit') || msg.includes('429'))
      return 'Rate limit exceeded. Please wait and try again.';
    if (msg.includes('overloaded') || msg.includes('529'))
      return 'Anthropic API is temporarily overloaded. Please retry.';
    if (msg.includes('could not resolve the model') || msg.includes('not_found_error') || msg.includes('model:'))
      return 'Invalid model selected. Please choose a supported Claude model.';
    if (msg.includes('permission') || msg.includes('forbidden') || msg.includes('403'))
      return 'Your API key does not have permission to use this model.';
    if (msg.includes('timeout') || msg.includes('aborted') || msg.includes('econnreset') || msg.includes('function_invocation_timeout'))
      return 'Request timed out. Please try again with a shorter prompt or a faster model.';
    if (msg.includes('econnrefused') || msg.includes('fetch failed') || msg.includes('network') || msg.includes('dns'))
      return 'Could not reach the Anthropic API. Please check your connection and try again.';
    if (msg.includes('invalid_request_error') || msg.includes('400'))
      return 'Invalid request. Please check your parameters and try again.';

    const errorType = error instanceof Error ? error.constructor.name : 'Unknown';
    return `Generation failed (${errorType}). Please try again or switch models.`;
  }

  it('sanitizes auth errors', () => {
    expect(sanitizeError('authentication_error: invalid x-api-key')).toBe(
      'Invalid API key. Please check your Anthropic API key.'
    );
  });

  it('sanitizes rate limit errors', () => {
    expect(sanitizeError('rate_limit_error 429')).toBe(
      'Rate limit exceeded. Please wait and try again.'
    );
  });

  it('hides unknown error details (no API key leaking)', () => {
    expect(sanitizeError('Internal: sk-ant-api03-SECRET leaked')).toBe(
      'Generation failed (Unknown). Please try again or switch models.'
    );
  });

  it('sanitizes timeout errors', () => {
    expect(sanitizeError('FUNCTION_INVOCATION_TIMEOUT')).toBe(
      'Request timed out. Please try again with a shorter prompt or a faster model.'
    );
  });

  it('sanitizes network errors', () => {
    expect(sanitizeError('TypeError: fetch failed')).toBe(
      'Could not reach the Anthropic API. Please check your connection and try again.'
    );
  });

  it('sanitizes permission errors', () => {
    expect(sanitizeError('Error: 403 forbidden')).toBe(
      'Your API key does not have permission to use this model.'
    );
  });

  it('sanitizes model not found errors', () => {
    expect(sanitizeError('not_found_error: model: claude-unknown')).toBe(
      'Invalid model selected. Please choose a supported Claude model.'
    );
  });

  it('sanitizes overload errors', () => {
    expect(sanitizeError('Error: 529 overloaded')).toBe(
      'Anthropic API is temporarily overloaded. Please retry.'
    );
  });

  it('includes error class name for typed errors', () => {
    const err = new TypeError('something unexpected');
    // TypeError contains 'network' substring? No — but msg includes 'typeerror' now
    // Actually "typeerror: something unexpected" doesn't match any pattern
    // So it falls through to the catch-all with the class name
    expect(sanitizeError(err)).toBe(
      'Generation failed (TypeError). Please try again or switch models.'
    );
  });
});
