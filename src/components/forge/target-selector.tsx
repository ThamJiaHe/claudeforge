'use client';

import { useForgeStore } from '@/store/use-forge-store';
import { TARGETS } from '@/lib/providers';
import type { TargetId } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TargetSelector() {
  const target = useForgeStore((s) => s.target);
  const setTarget = useForgeStore((s) => s.setTarget);

  return (
    <Select value={target} onValueChange={(v) => setTarget(v as TargetId)}>
      <SelectTrigger className="w-full min-w-0 lg:w-auto lg:min-w-[140px] lg:max-w-[220px]">
        <SelectValue placeholder="Target model" />
      </SelectTrigger>
      <SelectContent>
        {TARGETS.map((t) => (
          <SelectItem key={t.id} value={t.id} textValue={t.displayName}>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{t.displayName}</span>
              <span className="text-xs text-muted-foreground">
                {t.description}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
