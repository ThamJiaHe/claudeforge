'use client';

import { useForgeStore } from '@/store/use-forge-store';
import { PROVIDERS } from '@/lib/providers';
import type { ProviderId } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ProviderSelector() {
  const provider = useForgeStore((s) => s.provider);
  const setProvider = useForgeStore((s) => s.setProvider);
  const setModel = useForgeStore((s) => s.setModel);
  const setCustomBaseUrl = useForgeStore((s) => s.setCustomBaseUrl);
  const setCustomModelName = useForgeStore((s) => s.setCustomModelName);

  const handleChange = (value: string) => {
    const newProvider = PROVIDERS.find((p) => p.id === value);
    if (!newProvider) return;

    setProvider(value as ProviderId);

    // Auto-select first model of new provider
    if (newProvider.models.length > 0) {
      setModel(newProvider.models[0].id);
    }

    // Reset custom fields when switching away from providers that use them
    if (!newProvider.allowCustomBaseUrl) {
      setCustomBaseUrl('');
      setCustomModelName('');
    }
  };

  return (
    <Select value={provider} onValueChange={handleChange}>
      <SelectTrigger className="w-full min-w-0 lg:w-auto lg:min-w-[170px] lg:max-w-[260px]">
        <SelectValue placeholder="Select provider" />
      </SelectTrigger>
      <SelectContent>
        {PROVIDERS.map((p) => (
          <SelectItem key={p.id} value={p.id} textValue={p.name}>
            <span className="font-medium">{p.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
