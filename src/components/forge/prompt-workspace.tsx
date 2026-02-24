'use client';

import { ConfigBar } from './config-bar';
import { InputPanel } from './input-panel';
import { OutputPanel } from './output-panel';

export function PromptWorkspace() {
  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 pb-16 sm:px-6">
      <ConfigBar />
      <InputPanel />
      <OutputPanel />
    </section>
  );
}
