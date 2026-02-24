'use client';

import { useForgeStore } from '@/store/use-forge-store';
import { useHistoryStore } from '@/store/use-history-store';
import type { GenerationResult, PromptHistoryEntry } from '@/lib/types';
import { toast } from 'sonner';

export function useGenerate() {
  const store = useForgeStore();
  const addEntry = useHistoryStore((s) => s.addEntry);

  const generate = async () => {
    if (!store.apiKey) {
      toast.error('Please enter your Anthropic API key');
      return;
    }
    if (!store.inputText.trim()) {
      toast.error('Please enter a prompt to transform');
      return;
    }

    store.setIsGenerating(true);
    store.setError(null);
    store.setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: store.inputText,
          params: {
            model: store.model,
            format: store.format,
            enableThinking: store.enableThinking,
            effort: store.effort,
            maxTokens: store.maxTokens,
          },
          apiKey: store.apiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.error) throw new Error(data.error);
              if (data.text) accumulated += data.text;
              if (data.done) {
                // Parse the accumulated text as a generation result
                // The API returns the full prompt text
                const result: GenerationResult = {
                  prompt: accumulated,
                  structuredData: parseStructuredData(accumulated),
                  suggestedSkills: [],
                  parameterTips: [],
                  model: store.model,
                  format: store.format,
                };
                store.setResult(result);

                // Add to history
                const historyEntry: PromptHistoryEntry = {
                  id: crypto.randomUUID(),
                  title: store.inputText.slice(0, 80),
                  inputText: store.inputText,
                  outputPrompt: accumulated,
                  model: store.model,
                  format: store.format,
                  parameters: {
                    model: store.model,
                    format: store.format,
                    enableThinking: store.enableThinking,
                    effort: store.effort,
                    maxTokens: store.maxTokens,
                  },
                  suggestedSkills: [],
                  isFavorite: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                addEntry(historyEntry);
                toast.success('Prompt generated successfully!');
              }
            } catch (e) {
              // Skip unparseable lines
              if (
                e instanceof Error &&
                e.message !== 'Generation failed'
              )
                continue;
              throw e;
            }
          }
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      store.setError(message);
      toast.error(`Generation failed: ${message}`);
    } finally {
      store.setIsGenerating(false);
    }
  };

  return { generate, isGenerating: store.isGenerating };
}

// Simple parser to extract structured data from the prompt output
function parseStructuredData(text: string): Record<string, string> {
  // Try to extract role, task, rules sections from the generated prompt
  const sections: Record<string, string> = {};

  // Try XML-style extraction
  const xmlTags = [
    'role',
    'task',
    'rules',
    'output_format',
    'examples',
    'thinking',
    'background',
  ];
  for (const tag of xmlTags) {
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = text.match(regex);
    if (match) {
      const key = tag === 'output_format' ? 'format' : tag;
      sections[key] = match[1].trim();
    }
  }

  // If no XML sections found, just store the whole thing
  if (Object.keys(sections).length === 0) {
    sections['task'] = text;
  }

  return sections;
}
