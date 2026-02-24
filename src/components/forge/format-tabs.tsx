'use client';

import { useMemo } from 'react';
import { useForgeStore } from '@/store/use-forge-store';
import { FORMATS } from '@/lib/constants';
import { convertFormat } from '@/lib/engine/format-converter';
import type { PromptFormat } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CodeBlock } from './code-block';
import { CopyButton } from './copy-button';

/** Short display names for mobile-friendly tab labels */
const SHORT_NAMES: Record<PromptFormat, string> = {
  xml: 'XML',
  toon: 'TOON',
  harness: 'Harness',
  markdown: 'MD',
  plaintext: 'Plain',
  json: 'JSON',
  yaml: 'YAML',
  claudemd: 'Claude.md',
  'system-user-split': 'Sys+User',
};

export function FormatTabs() {
  const result = useForgeStore((s) => s.result);
  const activeOutputFormat = useForgeStore((s) => s.activeOutputFormat);
  const setActiveOutputFormat = useForgeStore((s) => s.setActiveOutputFormat);

  // Memoize all format conversions so we only recompute when structuredData changes
  const convertedOutputs = useMemo(() => {
    if (!result) return {};
    const outputs: Partial<Record<PromptFormat, string>> = {};
    for (const format of FORMATS) {
      outputs[format.id] = convertFormat(result.structuredData, format.id);
    }
    return outputs;
  }, [result]);

  if (!result) return null;

  return (
    <Tabs
      value={activeOutputFormat}
      onValueChange={(v) => setActiveOutputFormat(v as PromptFormat)}
      className="w-full"
    >
      <TabsList className="w-full flex-wrap justify-start">
        {FORMATS.map((format) => (
          <TabsTrigger key={format.id} value={format.id} className="text-xs">
            <span className="hidden sm:inline">{format.displayName}</span>
            <span className="sm:hidden">{SHORT_NAMES[format.id]}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {FORMATS.map((format) => {
        const output = convertedOutputs[format.id] ?? '';
        return (
          <TabsContent key={format.id} value={format.id}>
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CopyButton text={output} />
              </div>
              <CodeBlock code={output} language={format.syntaxLanguage} />
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
