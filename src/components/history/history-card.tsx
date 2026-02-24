'use client';

import { useState } from 'react';
import { Star, Trash2, Clock, Copy } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MODELS, FORMATS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { PromptHistoryEntry } from '@/lib/types';

interface HistoryCardProps {
  entry: PromptHistoryEntry;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

const MODEL_COLORS: Record<string, string> = {
  'claude-opus-4-6': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'claude-sonnet-4-6': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  'claude-haiku-4-5': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
};

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  return `${diffMonths}mo ago`;
}

function getModelDisplayName(modelId: string): string {
  return MODELS.find((m) => m.id === modelId)?.displayName ?? modelId;
}

function getFormatDisplayName(formatId: string): string {
  return FORMATS.find((f) => f.id === formatId)?.displayName ?? formatId;
}

export function HistoryCard({ entry, onToggleFavorite, onDelete }: HistoryCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(entry.outputPrompt);
      toast.success('Prompt copied to clipboard');
    } catch {
      toast.error('Failed to copy prompt');
    }
  };

  const handleDelete = () => {
    onDelete(entry.id);
    setShowDeleteDialog(false);
    toast.success('Prompt deleted');
  };

  const modelColor = MODEL_COLORS[entry.model] ?? 'bg-secondary text-secondary-foreground';

  return (
    <>
      <Card
        className="group cursor-pointer py-4 transition-colors hover:bg-accent/50"
        onClick={handleCopyToClipboard}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCopyToClipboard();
          }
        }}
      >
        <CardContent className="flex flex-col gap-3 px-4 sm:px-6">
          {/* Top row: title + actions */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-semibold leading-tight">
              {entry.title}
            </h3>
            <div className="flex shrink-0 items-center gap-1">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyToClipboard();
                      }}
                      aria-label="Copy prompt to clipboard"
                    >
                      <Copy className="size-3.5 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Copy prompt</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(entry.id);
                      }}
                      aria-label={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star
                        className={cn(
                          'size-3.5',
                          entry.isFavorite
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {entry.isFavorite ? 'Unfavorite' : 'Favorite'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                      }}
                      aria-label="Delete prompt"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Delete</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Input text preview */}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {entry.inputText}
          </p>

          {/* Bottom row: badges + timestamp */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn('border-transparent text-xs', modelColor)}
            >
              {getModelDisplayName(entry.model)}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {getFormatDisplayName(entry.format)}
            </Badge>
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {getRelativeTime(entry.createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{entry.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
