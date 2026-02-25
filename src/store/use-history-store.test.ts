import { describe, it, expect, beforeEach } from 'vitest';
import { useHistoryStore } from './use-history-store';
import type { PromptHistoryEntry } from '@/lib/types';

function makeEntry(overrides: Partial<PromptHistoryEntry> = {}): PromptHistoryEntry {
  return {
    id: crypto.randomUUID(),
    title: 'Test prompt',
    inputText: 'Write a hello world',
    outputPrompt: 'Short output',
    model: 'claude-sonnet-4-6',
    format: 'xml',
    parameters: {
      provider: 'anthropic',
      target: 'claude',
      model: 'claude-sonnet-4-6',
      format: 'xml',
      enableThinking: false,
      effort: 'medium',
      maxTokens: 4096,
    },
    suggestedSkills: [],
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('useHistoryStore', () => {
  beforeEach(() => {
    useHistoryStore.getState().clearHistory();
  });

  it('adds entries', () => {
    const entry = makeEntry();
    useHistoryStore.getState().addEntry(entry);
    expect(useHistoryStore.getState().entries).toHaveLength(1);
    expect(useHistoryStore.getState().entries[0].id).toBe(entry.id);
  });

  it('removes entries', () => {
    const entry = makeEntry();
    useHistoryStore.getState().addEntry(entry);
    useHistoryStore.getState().removeEntry(entry.id);
    expect(useHistoryStore.getState().entries).toHaveLength(0);
  });

  it('toggles favorite', () => {
    const entry = makeEntry();
    useHistoryStore.getState().addEntry(entry);
    expect(useHistoryStore.getState().entries[0].isFavorite).toBe(false);
    useHistoryStore.getState().toggleFavorite(entry.id);
    expect(useHistoryStore.getState().entries[0].isFavorite).toBe(true);
  });

  // ── Finding 11: Output truncation ──────────────────────

  it('truncates long outputPrompt on storage', () => {
    const longOutput = 'x'.repeat(10_000);
    const entry = makeEntry({ outputPrompt: longOutput });
    useHistoryStore.getState().addEntry(entry);

    const stored = useHistoryStore.getState().entries[0];
    expect(stored.outputPrompt.length).toBeLessThan(longOutput.length);
    expect(stored.outputPrompt).toContain('[Truncated for storage]');
  });

  it('does NOT truncate short outputPrompt', () => {
    const entry = makeEntry({ outputPrompt: 'Short output' });
    useHistoryStore.getState().addEntry(entry);
    expect(useHistoryStore.getState().entries[0].outputPrompt).toBe('Short output');
  });

  // ── Finding 11: 30-day retention eviction ──────────────

  it('evicts non-favorite entries older than 30 days', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 31);

    const oldEntry = makeEntry({ createdAt: oldDate.toISOString() });
    // Directly set state with old entry to simulate existing data
    useHistoryStore.setState({ entries: [oldEntry] });

    // Adding a new entry triggers eviction
    const newEntry = makeEntry();
    useHistoryStore.getState().addEntry(newEntry);

    const entries = useHistoryStore.getState().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe(newEntry.id);
  });

  it('preserves favorite entries even past retention window', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 31);

    const oldFav = makeEntry({ createdAt: oldDate.toISOString(), isFavorite: true });
    useHistoryStore.setState({ entries: [oldFav] });

    const newEntry = makeEntry();
    useHistoryStore.getState().addEntry(newEntry);

    const entries = useHistoryStore.getState().entries;
    expect(entries).toHaveLength(2);
    expect(entries.some((e) => e.id === oldFav.id)).toBe(true);
  });
});
