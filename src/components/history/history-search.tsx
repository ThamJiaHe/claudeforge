'use client';

import { Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MODELS, FORMATS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface HistorySearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  modelFilter: string;
  onModelFilterChange: (model: string) => void;
  formatFilter: string;
  onFormatFilterChange: (format: string) => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: () => void;
}

export function HistorySearch({
  searchQuery,
  onSearchChange,
  modelFilter,
  onModelFilterChange,
  formatFilter,
  onFormatFilterChange,
  showFavoritesOnly,
  onFavoritesToggle,
}: HistorySearchProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={modelFilter} onValueChange={onModelFilterChange}>
          <SelectTrigger className="w-[140px]" size="sm">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            {MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={formatFilter} onValueChange={onFormatFilterChange}>
          <SelectTrigger className="w-[150px]" size="sm">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            {FORMATS.map((format) => (
              <SelectItem key={format.id} value={format.id}>
                {format.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showFavoritesOnly ? 'default' : 'outline'}
          size="sm"
          onClick={onFavoritesToggle}
          className="gap-1.5"
          aria-label={showFavoritesOnly ? 'Show all prompts' : 'Show favorites only'}
        >
          <Star
            className={cn(
              'size-3.5',
              showFavoritesOnly && 'fill-current'
            )}
          />
          <span className="hidden sm:inline">Favorites</span>
        </Button>
      </div>
    </div>
  );
}
