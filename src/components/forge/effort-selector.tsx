'use client';

import { useMemo } from 'react';
import { useForgeStore } from '@/store/use-forge-store';
import { getProvider } from '@/lib/providers';
import type { EffortLevel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const EFFORT_LEVELS: { value: EffortLevel; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Med' },
  { value: 'high', label: 'High' },
  { value: 'max', label: 'Max' },
];

export function EffortSelector() {
  const provider = useForgeStore((s) => s.provider);
  const model = useForgeStore((s) => s.model);
  const enableThinking = useForgeStore((s) => s.enableThinking);
  const effort = useForgeStore((s) => s.effort);
  const setEffort = useForgeStore((s) => s.setEffort);

  // Only Claude Opus 4.6 supports the "max" effort level
  const supportsEffortMax = useMemo(() => {
    const prov = getProvider(provider);
    const modelDef = prov?.models.find((m) => m.id === model);
    return modelDef?.id === 'claude-opus-4-6';
  }, [provider, model]);

  // Only visible when extended thinking is enabled
  if (!enableThinking) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {EFFORT_LEVELS.map((level) => {
          const isMaxDisabled = level.value === 'max' && !supportsEffortMax;
          const isSelected = effort === level.value;

          const button = (
            <Button
              key={level.value}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              disabled={isMaxDisabled}
              onClick={() => setEffort(level.value)}
              className="px-2.5"
            >
              {level.label}
            </Button>
          );

          if (isMaxDisabled) {
            return (
              <Tooltip key={level.value}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent>
                  <p>Only available with Opus 4.6</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </div>
    </TooltipProvider>
  );
}
