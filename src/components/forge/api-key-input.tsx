'use client';

import { useState } from 'react';
import { Eye, EyeOff, Pencil, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForgeStore } from '@/store/use-forge-store';

export function ApiKeyInput() {
  const apiKey = useForgeStore((s) => s.apiKey);
  const setApiKey = useForgeStore((s) => s.setApiKey);
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(!apiKey);

  // When the key is set and user is not editing, show collapsed view
  if (apiKey && !isEditing) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <KeyRound className="size-3.5" />
        <span className="font-mono">
          API Key: {'*'.repeat(Math.min(apiKey.length, 20))}
        </span>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setIsEditing(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-3" />
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type={showKey ? 'text' : 'password'}
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onBlur={() => {
              if (apiKey) setIsEditing(false);
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
          >
            {showKey ? (
              <EyeOff className="size-3.5" />
            ) : (
              <Eye className="size-3.5" />
            )}
          </Button>
        </div>
        {apiKey && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setIsEditing(false)}
            className="text-muted-foreground"
          >
            Done
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is stored locally in your browser. Never sent to our
        servers.
      </p>
    </div>
  );
}
