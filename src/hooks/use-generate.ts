'use client';

import { useForgeStore } from '@/store/use-forge-store';
import { useHistoryStore } from '@/store/use-history-store';
import { getProvider } from '@/lib/providers';
import type { GenerationResult, PromptHistoryEntry } from '@/lib/types';
import { toast } from 'sonner';

export function useGenerate() {
  const store = useForgeStore();
  const addEntry = useHistoryStore((s) => s.addEntry);

  const generate = async () => {
    // Provider-aware API key validation
    const provider = getProvider(store.provider);
    if (provider?.requiresApiKey && !store.apiKey) {
      toast.error(`Please enter your ${provider.name} API key`);
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
            provider: store.provider,
            model: store.model,
            target: store.target,
            format: store.format,
            enableThinking: store.enableThinking,
            effort: store.effort,
            maxTokens: store.maxTokens,
            customBaseUrl: store.customBaseUrl || undefined,
            customModelName: store.customModelName || undefined,
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
      let lineBuffer = ''; // Buffer partial lines across chunks

      while (true) {
        const { done, value } = await reader.read();

        if (!done) {
          const chunk = decoder.decode(value, { stream: true });
          lineBuffer += chunk;
        } else {
          // Flush the TextDecoder and append any remaining buffered data
          lineBuffer += decoder.decode();
        }

        // Only process complete lines (terminated by \n)
        const lines = lineBuffer.split('\n');
        // The last element may be an incomplete line — keep it in the buffer
        lineBuffer = done ? '' : (lines.pop() ?? '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            let data: Record<string, unknown>;
            try {
              data = JSON.parse(line.slice(6));
            } catch {
              continue; // Skip unparseable SSE lines
            }
            if (data.error) throw new Error(String(data.error));
            if (data.text) accumulated += String(data.text);
            if (data.done) {
                // The meta-prompt instructs the model to return JSON with
                // { prompt, structuredData, suggestedSkills, parameterTips }
                let parsedPrompt = accumulated;
                let structuredData: Record<string, string> = {};
                let suggestedSkills: GenerationResult['suggestedSkills'] = [];
                let parameterTips: string[] = [];

                try {
                  // Strip markdown code fences if the model wrapped them
                  const cleaned = accumulated
                    .trim()
                    .replace(/^```(?:json)?\s*\n?/i, '')
                    .replace(/\n?```\s*$/i, '')
                    .trim();
                  const parsed = JSON.parse(cleaned);
                  if (parsed && typeof parsed.prompt === 'string') {
                    parsedPrompt = parsed.prompt;
                    structuredData = parsed.structuredData ?? {};
                    suggestedSkills = Array.isArray(parsed.suggestedSkills)
                      ? parsed.suggestedSkills
                      : [];
                    parameterTips = Array.isArray(parsed.parameterTips)
                      ? parsed.parameterTips
                      : [];
                  }
                } catch {
                  // Fallback: response was not JSON — use raw text as prompt
                  structuredData = parseStructuredData(accumulated);
                }

                const result: GenerationResult = {
                  prompt: parsedPrompt,
                  structuredData,
                  suggestedSkills,
                  parameterTips,
                  model: store.model,
                  format: store.format,
                };
                store.setResult(result);

                // Add to history
                const historyEntry: PromptHistoryEntry = {
                  id: crypto.randomUUID(),
                  title: store.inputText.slice(0, 80),
                  inputText: store.inputText,
                  outputPrompt: parsedPrompt,
                  model: store.model,
                  format: store.format,
                  parameters: {
                    provider: store.provider,
                    model: store.model,
                    target: store.target,
                    format: store.format,
                    enableThinking: store.enableThinking,
                    effort: store.effort,
                    maxTokens: store.maxTokens,
                    customBaseUrl: store.customBaseUrl || undefined,
                    customModelName: store.customModelName || undefined,
                  },
                  suggestedSkills: [],
                  isFavorite: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                addEntry(historyEntry);
                toast.success('Prompt generated successfully!');
              }
          }
        }

        if (done) break;
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
