'use client';

import { useForgeStore } from '@/store/use-forge-store';
import { getProvider } from '@/lib/providers';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ModelSelector() {
  const provider = useForgeStore((s) => s.provider);
  const model = useForgeStore((s) => s.model);
  const setModel = useForgeStore((s) => s.setModel);
  const customModelName = useForgeStore((s) => s.customModelName);
  const setCustomModelName = useForgeStore((s) => s.setCustomModelName);
  const customBaseUrl = useForgeStore((s) => s.customBaseUrl);
  const setCustomBaseUrl = useForgeStore((s) => s.setCustomBaseUrl);

  const providerDef = getProvider(provider);
  const models = providerDef?.models ?? [];
  const showCustomInputs = providerDef?.allowCustomBaseUrl ?? false;

  // Check if the selected model is one that expects a custom model name
  const selectedModel = models.find((m) => m.id === model);
  const needsCustomModelName = selectedModel?.apiString === '';

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto">
      <Select
        value={model}
        onValueChange={(v) => setModel(v)}
      >
        <SelectTrigger className="w-full min-w-0 lg:w-auto lg:min-w-[160px] lg:max-w-[260px]">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((m) => (
            <SelectItem key={m.id} value={m.id} textValue={m.displayName}>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{m.displayName}</span>
                <span className="text-xs text-muted-foreground">
                  {m.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Custom model name input for providers that allow it */}
      {needsCustomModelName && (
        <Input
          type="text"
          placeholder="Model name (e.g. llama3.3, mistral...)"
          value={customModelName}
          onChange={(e) => setCustomModelName(e.target.value)}
          className="text-sm"
        />
      )}

      {/* Custom base URL input */}
      {showCustomInputs && (
        <Input
          type="url"
          placeholder={providerDef?.defaultBaseUrl || 'http://localhost:11434/v1'}
          value={customBaseUrl}
          onChange={(e) => setCustomBaseUrl(e.target.value)}
          className="text-sm text-muted-foreground"
        />
      )}
    </div>
  );
}
