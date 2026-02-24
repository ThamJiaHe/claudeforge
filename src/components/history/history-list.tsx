'use client';

import { Clock, Search } from 'lucide-react';
import { HistoryCard } from './history-card';
import type { PromptHistoryEntry } from '@/lib/types';

interface HistoryListProps {
  entries: PromptHistoryEntry[];
  hasAnyEntries: boolean;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HistoryList({
  entries,
  hasAnyEntries,
  onToggleFavorite,
  onDelete,
}: HistoryListProps) {
  // Empty state: no entries at all
  if (!hasAnyEntries) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Clock className="size-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">No prompts yet</p>
          <p className="text-sm text-muted-foreground">
            Generate your first prompt to see it here.
          </p>
        </div>
      </div>
    );
  }

  // Filtered empty state: entries exist but none match filters
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Search className="size-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">No results</p>
          <p className="text-sm text-muted-foreground">
            No prompts match your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <HistoryCard
          key={entry.id}
          entry={entry}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
