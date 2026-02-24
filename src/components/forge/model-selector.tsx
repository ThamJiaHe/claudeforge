'use client';

import { useForgeStore } from '@/store/use-forge-store';
import { MODELS } from '@/lib/constants';
import type { ClaudeModel } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ModelSelector() {
  const model = useForgeStore((s) => s.model);
  const setModel = useForgeStore((s) => s.setModel);

  return (
    <Select value={model} onValueChange={(v) => setModel(v as ClaudeModel)}>
      <SelectTrigger className="w-auto min-w-[160px] max-w-[260px]">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {MODELS.map((m) => (
          <SelectItem key={m.id} value={m.id} textValue={m.displayName}>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{m.displayName}</span>
              <span className="text-xs text-muted-foreground">
                {m.description}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
