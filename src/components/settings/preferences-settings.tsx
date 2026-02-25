'use client';

import { useTheme } from 'next-themes';
import { Settings2 } from 'lucide-react';
import { useForgeStore } from '@/store/use-forge-store';
import { FORMATS, getProvider } from '@/lib/constants';
import type { PromptFormat } from '@/lib/types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;

export function PreferencesSettings() {
  const provider = useForgeStore((s) => s.provider);
  const model = useForgeStore((s) => s.model);
  const setModel = useForgeStore((s) => s.setModel);
  const format = useForgeStore((s) => s.format);
  const setFormat = useForgeStore((s) => s.setFormat);
  const { theme, setTheme } = useTheme();

  const providerDef = getProvider(provider);
  const models = providerDef?.models ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="size-5" />
          Preferences
        </CardTitle>
        <CardDescription>
          Configure default settings for prompt generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Model */}
        <div className="space-y-2">
          <Label htmlFor="default-model">Default Model</Label>
          <p className="text-xs text-muted-foreground">
            The model used by default when generating prompts ({providerDef?.name ?? 'Unknown'})
          </p>
          <Select
            value={model}
            onValueChange={(v) => setModel(v)}
          >
            <SelectTrigger id="default-model" className="w-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
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
        </div>

        {/* Default Format */}
        <div className="space-y-2">
          <Label htmlFor="default-format">Default Format</Label>
          <p className="text-xs text-muted-foreground">
            The output format used by default for generated prompts
          </p>
          <Select
            value={format}
            onValueChange={(v) => setFormat(v as PromptFormat)}
          >
            <SelectTrigger id="default-format" className="w-full">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{f.displayName}</span>
                    <span className="text-xs text-muted-foreground">
                      {f.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <Label htmlFor="theme-select">Theme</Label>
          <p className="text-xs text-muted-foreground">
            Choose your preferred appearance for the application
          </p>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger id="theme-select" className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {THEME_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
