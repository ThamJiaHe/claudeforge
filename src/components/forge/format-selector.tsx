'use client';

import { useForgeStore } from '@/store/use-forge-store';
import { FORMATS } from '@/lib/constants';
import type { PromptFormat } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function FormatSelector() {
  const format = useForgeStore((s) => s.format);
  const setFormat = useForgeStore((s) => s.setFormat);

  return (
    <Select value={format} onValueChange={(v) => setFormat(v as PromptFormat)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select format" />
      </SelectTrigger>
      <SelectContent>
        {FORMATS.map((f) => (
          <SelectItem key={f.id} value={f.id}>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{f.displayName}</span>
              <span className="text-xs text-muted-foreground">
                {f.description}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
