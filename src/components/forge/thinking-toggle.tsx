'use client';

import { useEffect, useMemo } from 'react';
import { useForgeStore } from '@/store/use-forge-store';
import { MODELS } from '@/lib/constants';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ThinkingToggle() {
  const model = useForgeStore((s) => s.model);
  const enableThinking = useForgeStore((s) => s.enableThinking);
  const setEnableThinking = useForgeStore((s) => s.setEnableThinking);

  const modelInfo = useMemo(
    () => MODELS.find((m) => m.id === model),
    [model]
  );

  const supportsThinking = modelInfo?.supportsThinking ?? false;

  // Auto-disable thinking when switching to a model that doesn't support it
  useEffect(() => {
    if (!supportsThinking && enableThinking) {
      setEnableThinking(false);
    }
  }, [supportsThinking, enableThinking, setEnableThinking]);

  const toggle = (
    <div className="flex items-center gap-2">
      <Switch
        id="thinking-toggle"
        checked={enableThinking}
        onCheckedChange={setEnableThinking}
        disabled={!supportsThinking}
      />
      <label
        htmlFor="thinking-toggle"
        className={`text-sm select-none ${
          !supportsThinking
            ? 'text-muted-foreground cursor-not-allowed'
            : 'cursor-pointer'
        }`}
      >
        Extended Thinking
      </label>
    </div>
  );

  if (!supportsThinking) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{toggle}</TooltipTrigger>
          <TooltipContent>
            <p>Not supported by this model</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return toggle;
}
