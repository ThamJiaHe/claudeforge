'use client';

import { motion } from 'framer-motion';
import { ProviderSelector } from './provider-selector';
import { TargetSelector } from './target-selector';
import { ModelSelector } from './model-selector';
import { FormatSelector } from './format-selector';
import { ThinkingToggle } from './thinking-toggle';
import { EffortSelector } from './effort-selector';
import { MaxTokensInput } from './max-tokens-input';
import { Label } from '@/components/ui/label';

export function ConfigBar() {
  return (
    <motion.div
      className="grid grid-cols-2 items-end gap-4 rounded-lg bg-muted/50 p-4 sm:gap-4 sm:p-4 md:grid-cols-3 lg:flex lg:flex-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
        <Label className="text-xs text-muted-foreground">Provider</Label>
        <ProviderSelector />
      </div>

      <div className="col-span-2 flex flex-col gap-1.5 md:col-span-2 lg:col-auto">
        <Label className="text-xs text-muted-foreground">Model</Label>
        <ModelSelector />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Target</Label>
        <TargetSelector />
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

      <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1 sm:min-w-[180px]">
        <Label className="text-xs text-muted-foreground">Max Tokens</Label>
        <MaxTokensInput />
      </div>
    </motion.div>
  );
}
