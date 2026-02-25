'use client';

import { useForgeStore } from '@/store/use-forge-store';
import { FORMATS, isValidFormat } from '@/lib/constants';
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
    <Select value={format} onValueChange={(v) => { if (isValidFormat(v)) setFormat(v); }}>
      <SelectTrigger className="w-auto min-w-[140px] max-w-[220px]">
        <SelectValue placeholder="Select format" />
      </SelectTrigger>
      <SelectContent>
        {FORMATS.map((f) => (
          <SelectItem key={f.id} value={f.id} textValue={f.displayName}>
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
