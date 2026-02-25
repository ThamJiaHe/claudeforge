'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForgeStore } from '@/store/use-forge-store';
import { useGenerate } from '@/hooks/use-generate';
import { ApiKeyInput } from '@/components/forge/api-key-input';

export function InputPanel() {
  const inputText = useForgeStore((s) => s.inputText);
  const setInputText = useForgeStore((s) => s.setInputText);
  const error = useForgeStore((s) => s.error);
  const { generate, isGenerating } = useGenerate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    // Reset height to allow shrinking
    textarea.style.height = 'auto';
    // Set to scrollHeight but enforce a minimum
    const minHeight = 150;
    textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`;
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText, adjustTextareaHeight]);

  // Cmd/Ctrl+Enter keyboard shortcut to generate
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isGenerating) {
          generate();
        }
      }
    },
    [generate, isGenerating]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Textarea */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want the AI to do..."
          className="min-h-[150px] resize-none pr-4 pb-8 text-base leading-relaxed"
          disabled={isGenerating}
        />
        {/* Character count */}
        <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-muted-foreground">
          {inputText.length.toLocaleString()} chars
        </span>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Generate button + shortcut hint */}
      <div className="flex items-center gap-3">
        <Button
          size="lg"
          onClick={generate}
          disabled={isGenerating || !inputText.trim()}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate
            </>
          )}
        </Button>
        <span className="text-xs text-muted-foreground">
          {typeof navigator !== 'undefined' &&
          /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? '\u2318'
            : 'Ctrl'}
          +Enter
        </span>
      </div>

      {/* API Key input (collapsible) */}
      <div className="border-t pt-3">
        <ApiKeyInput />
      </div>
    </div>
  );
}
