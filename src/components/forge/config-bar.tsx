'use client';

import { motion } from 'framer-motion';
import { ModelSelector } from './model-selector';
import { FormatSelector } from './format-selector';
import { ThinkingToggle } from './thinking-toggle';
import { EffortSelector } from './effort-selector';
import { MaxTokensInput } from './max-tokens-input';
import { Label } from '@/components/ui/label';

export function ConfigBar() {
  return (
    <motion.div
      className="flex flex-wrap items-end gap-4 rounded-lg bg-muted/50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Model</Label>
        <ModelSelector />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Format</Label>
        <FormatSelector />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Thinking</Label>
        <ThinkingToggle />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Effort</Label>
        <EffortSelector />
      </div>

      <div className="flex flex-col gap-1.5 min-w-[200px]">
        <Label className="text-xs text-muted-foreground">Max Tokens</Label>
        <MaxTokensInput />
      </div>
    </motion.div>
  );
}
