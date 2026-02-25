import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PromptHistoryEntry } from '@/lib/types';

const MAX_ENTRIES = 500;
const MAX_OUTPUT_LENGTH = 5_000; // Truncate stored output to limit localStorage size
const RETENTION_DAYS = 30;

interface HistoryState {
  entries: PromptHistoryEntry[];
  addEntry: (entry: PromptHistoryEntry) => void;
  removeEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
  getEntry: (id: string) => PromptHistoryEntry | undefined;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) =>
        set((state) => {
          const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;

          // Truncate output for storage efficiency
          const trimmed: PromptHistoryEntry = {
            ...entry,
            outputPrompt:
              entry.outputPrompt.length > MAX_OUTPUT_LENGTH
                ? entry.outputPrompt.slice(0, MAX_OUTPUT_LENGTH) +
                  '\n\n[Truncated for storage]'
                : entry.outputPrompt,
          };

          // Evict non-favorite entries older than retention window
          const active = state.entries.filter(
            (e) => e.isFavorite || new Date(e.createdAt).getTime() > cutoff
          );

          return {
            entries: [trimmed, ...active].slice(0, MAX_ENTRIES),
          };
        }),

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
          ),
        })),

      clearHistory: () => set({ entries: [] }),

      getEntry: (id) => get().entries.find((e) => e.id === id),
    }),
    { name: 'claudeforge-history' }
  )
);
