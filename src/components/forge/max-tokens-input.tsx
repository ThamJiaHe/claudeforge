'use client';

import { useMemo } from 'react';
import { useForgeStore } from '@/store/use-forge-store';
import { MODELS } from '@/lib/constants';
import { Slider } from '@/components/ui/slider';

export function MaxTokensInput() {
  const model = useForgeStore((s) => s.model);
  const maxTokens = useForgeStore((s) => s.maxTokens);
  const setMaxTokens = useForgeStore((s) => s.setMaxTokens);

  const modelInfo = useMemo(
    () => MODELS.find((m) => m.id === model),
    [model]
  );

  const maxOutputTokens = modelInfo?.maxOutputTokens ?? 8_192;

  // Clamp current value within the valid range for this model
  const clampedValue = Math.min(Math.max(maxTokens, 256), maxOutputTokens);

  function formatTokenCount(count: number): string {
    if (count >= 1_000) {
      return `${(count / 1_000).toFixed(count % 1_000 === 0 ? 0 : 1)}K`;
    }
    return count.toLocaleString();
  }

  return (
    <div className="flex items-center gap-3 min-w-[180px]">
      <Slider
        value={[clampedValue]}
        onValueChange={(values) => setMaxTokens(values[0])}
        min={256}
        max={maxOutputTokens}
        step={256}
        className="flex-1"
      />
      <span className="text-sm font-mono text-muted-foreground whitespace-nowrap min-w-[48px] text-right">
        {formatTokenCount(clampedValue)}
      </span>
    </div>
  );
}
