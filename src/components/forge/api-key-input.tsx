'use client';

import { useState } from 'react';
import { Eye, EyeOff, Pencil, KeyRound, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForgeStore } from '@/store/use-forge-store';
import { getProvider } from '@/lib/providers';

/** Validates that the key roughly matches the provider's expected pattern */
function isValidApiKeyFormat(key: string, providerPrefix?: string): boolean {
  if (!providerPrefix) return true; // No prefix = no validation
  try {
    return new RegExp(providerPrefix).test(key);
  } catch {
    return true; // If the regex is invalid, skip validation
  }
}

export function ApiKeyInput() {
  const apiKey = useForgeStore((s) => s.apiKey);
  const setApiKey = useForgeStore((s) => s.setApiKey);
  const providerId = useForgeStore((s) => s.provider);
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(!apiKey);

  const provider = getProvider(providerId);
  const requiresKey = provider?.requiresApiKey ?? true;
  const placeholder = provider?.apiKeyPlaceholder ?? 'API key...';
  const prefix = provider?.apiKeyPrefix;

  // For providers that don't require a key, hide this component
  if (!requiresKey) {
    return (
      <p className="text-xs text-muted-foreground">
        No API key needed for {provider?.name ?? 'this provider'}.
        {provider?.allowCustomBaseUrl && ' Make sure your local server is running.'}
      </p>
    );
  }

  const hasKey = apiKey.length > 0;
  const formatWarning = hasKey && prefix ? !isValidApiKeyFormat(apiKey, prefix) : false;

  // When the key is set and user is not editing, show collapsed view
  if (apiKey && !isEditing) {
    return (
      <div className="space-y-1">
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
        {formatWarning && (
          <p className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
            <AlertTriangle className="size-3" />
            Key format doesn&apos;t match expected pattern ({placeholder})
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type={showKey ? 'text' : 'password'}
            placeholder={placeholder}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onBlur={() => {
              if (apiKey) setIsEditing(false);
            }}
            autoComplete="off"
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
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setIsEditing(false)}
            className="text-muted-foreground"
          >
            Done
          </Button>
        )}
      </div>
      {formatWarning && (
        <p className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
          <AlertTriangle className="size-3" />
          Key format doesn&apos;t match expected pattern ({placeholder})
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Stored in this browser tab only (sessionStorage). Your key is sent to our
        server solely to proxy the {provider?.name ?? 'AI'} API&nbsp;&mdash; never stored server-side.
      </p>
    </form>
  );
}
