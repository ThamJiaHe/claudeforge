'use client';

import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HistorySearch } from '@/components/history/history-search';
import { HistoryList } from '@/components/history/history-list';
import { useHistoryStore } from '@/store/use-history-store';

export default function HistoryPage() {
  const { entries, toggleFavorite, removeEntry, clearHistory } = useHistoryStore();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Derived filtered entries
  const filteredEntries = useMemo(() => {
    let result = entries;

    // Text search (title + inputText)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.inputText.toLowerCase().includes(query)
      );
    }

    // Model filter
    if (modelFilter !== 'all') {
      result = result.filter((e) => e.model === modelFilter);
    }

    // Format filter
    if (formatFilter !== 'all') {
      result = result.filter((e) => e.format === formatFilter);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter((e) => e.isFavorite);
    }

    return result;
  }, [entries, searchQuery, modelFilter, formatFilter, showFavoritesOnly]);

  const handleClearHistory = () => {
    clearHistory();
    setShowClearDialog(false);
    toast.success('History cleared');
  };

  const hasAnyEntries = entries.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Prompt History</h1>
        <p className="text-sm text-muted-foreground">
          Browse and manage your previously generated prompts. Click a card to copy its output.
        </p>
      </div>

      {/* Search and filters */}
      {hasAnyEntries && (
        <>
          <HistorySearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            modelFilter={modelFilter}
            onModelFilterChange={setModelFilter}
            formatFilter={formatFilter}
            onFormatFilterChange={setFormatFilter}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesToggle={() => setShowFavoritesOnly((prev) => !prev)}
          />
          <Separator className="my-6" />
        </>
      )}

      {/* History list */}
      <HistoryList
        entries={filteredEntries}
        hasAnyEntries={hasAnyEntries}
        onToggleFavorite={toggleFavorite}
        onDelete={removeEntry}
      />

      {/* Clear all history */}
      {hasAnyEntries && (
        <>
          <Separator className="my-6" />
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowClearDialog(true)}
            >
              <Trash2 className="size-3.5" />
              Clear All History
            </Button>
          </div>
        </>
      )}

      {/* Clear all confirmation dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All History</DialogTitle>
            <DialogDescription>
              This will permanently delete all {entries.length} prompt{entries.length !== 1 ? 's' : ''} from your
              history, including favorites. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearHistory}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
