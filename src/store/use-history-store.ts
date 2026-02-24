import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PromptHistoryEntry } from '@/lib/types';

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
        set((state) => ({
          entries: [entry, ...state.entries].slice(0, 500), // keep max 500
        })),

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
