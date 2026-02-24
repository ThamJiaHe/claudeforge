'use client';

import { useState } from 'react';
import { Eye, EyeOff, KeyRound, Trash2 } from 'lucide-react';
import { useForgeStore } from '@/store/use-forge-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ApiKeySettings() {
  const apiKey = useForgeStore((s) => s.apiKey);
  const setApiKey = useForgeStore((s) => s.setApiKey);
  const clearApiKey = useForgeStore((s) => s.clearApiKey);

  const [draft, setDraft] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 7)}${'•'.repeat(8)}`
    : null;

  function handleSave() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setApiKey(trimmed);
    setDraft('');
    setShowKey(false);
  }

  function handleClear() {
    clearApiKey();
    setDraft('');
    setShowConfirmClear(false);
    setShowKey(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="size-5" />
          API Key
        </CardTitle>
        <CardDescription>
          Your Anthropic API key for generating prompts with Claude
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current status */}
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">Status:</Label>
          {maskedKey ? (
            <span className="font-mono text-sm">{maskedKey}</span>
          ) : (
            <span className="text-sm text-muted-foreground">Not set</span>
          )}
        </div>

        {/* Input field */}
        <div className="space-y-2">
          <Label htmlFor="api-key-input">
            {apiKey ? 'Update API Key' : 'Enter API Key'}
          </Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                placeholder="sk-ant-..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                className="pr-10 font-mono text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </Button>
            </div>
            <Button
              onClick={handleSave}
              disabled={!draft.trim()}
              size="sm"
            >
              Save
            </Button>
          </div>
        </div>

        {/* Clear button with confirmation */}
        {apiKey && (
          <div className="flex items-center gap-2">
            {showConfirmClear ? (
              <>
                <span className="text-sm text-destructive">
                  Remove your API key?
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClear}
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmClear(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmClear(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
                Clear API Key
              </Button>
            )}
          </div>
        )}

        {/* Info text */}
        <p className="text-xs text-muted-foreground">
          Your API key is stored locally in your browser and never sent to our
          servers.
        </p>
      </CardContent>
    </Card>
  );
}
