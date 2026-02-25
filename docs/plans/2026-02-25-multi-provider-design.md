# Multi-Provider Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add multi-provider AI support (OpenAI, Gemini, OpenRouter, Ollama, LM Studio, custom) alongside Anthropic, with target-model prompt optimization, auth error fix, and responsive design audit.

**Architecture:** Two SDK integrations — Anthropic SDK (Claude) + OpenAI SDK (all OpenAI-compatible providers). Provider registry maps provider IDs to adapter factories. Target system (separate from provider) controls prompt optimization style.

**Tech Stack:** Next.js 16, React 19, TypeScript, Anthropic SDK v0.78, OpenAI SDK (new), Zustand, shadcn/ui, Tailwind CSS v4

---

### Task 1: Install OpenAI SDK

**Files:**
- Modify: `package.json`

**Step 1: Install the OpenAI SDK**

Run: `npm install openai`

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds without errors

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add openai sdk for multi-provider support"
```

---

### Task 2: Create Provider Type Definitions

**Files:**
- Create: `src/lib/providers/types.ts`
- Modify: `src/lib/types.ts`

**Step 1: Create `src/lib/providers/types.ts`**

```typescript
// ─── Provider Identifiers ─────────────────────────────────
export type ProviderId =
  | 'anthropic'
  | 'openai'
  | 'gemini'
  | 'openrouter'
  | 'ollama'
  | 'lmstudio'
  | 'custom';

export type SdkType = 'anthropic' | 'openai-compat';

// ─── Target Model Families ────────────────────────────────
export type TargetId = 'claude' | 'gpt' | 'gemini' | 'llama' | 'universal';

export interface TargetInfo {
  id: TargetId;
  displayName: string;
  description: string;
}

// ─── Provider Model ───────────────────────────────────────
export interface ProviderModel {
  id: string;          // e.g. 'gpt-4o', 'claude-sonnet-4-6'
  apiString: string;   // exact string sent to API
  displayName: string;
  description: string;
  maxOutputTokens: number;
  contextWindow: number;
}

// ─── Provider Definition ──────────────────────────────────
export interface ProviderDefinition {
  id: ProviderId;
  name: string;
  sdkType: SdkType;
  defaultBaseUrl: string;
  apiKeyPrefix: string;       // regex pattern for validation, empty = no key needed
  apiKeyPlaceholder: string;  // e.g. "sk-ant-..." or "sk-..."
  requiresApiKey: boolean;
  allowCustomBaseUrl: boolean; // true for ollama, lmstudio, custom
  models: ProviderModel[];
}

// ─── Adapter Interface ────────────────────────────────────
export interface StreamChunk {
  type: 'text' | 'done' | 'error';
  text?: string;
  usage?: { input_tokens: number; output_tokens: number };
  error?: string;
}

export interface ProviderAdapter {
  stream(params: {
    apiKey: string;
    model: string;
    system: string;
    userMessage: string;
    maxTokens: number;
    baseUrl?: string;
  }): AsyncIterable<StreamChunk>;
}
```

**Step 2: Update `src/lib/types.ts` to add multi-provider fields**

Add at the top of the file (after existing `ClaudeModel` type):

```typescript
import type { ProviderId, TargetId } from './providers/types';
```

Update `GenerationParams` to include provider fields (keep backward compat):

```typescript
export interface GenerationParams {
  model: string;          // was ClaudeModel, now any model ID
  format: PromptFormat;
  enableThinking: boolean;
  effort: EffortLevel;
  maxTokens: number;
  provider: ProviderId;   // NEW
  target: TargetId;       // NEW
  customBaseUrl?: string; // NEW — for ollama/lmstudio/custom
}
```

Update `GenerationResult`:

```typescript
export interface GenerationResult {
  prompt: string;
  structuredData: Record<string, string>;
  suggestedSkills: SkillSuggestion[];
  parameterTips: string[];
  model: string;         // was ClaudeModel
  format: PromptFormat;
}
```

Update `PromptHistoryEntry`:

```typescript
export interface PromptHistoryEntry {
  id: string;
  title: string;
  inputText: string;
  outputPrompt: string;
  model: string;          // was ClaudeModel
  format: PromptFormat;
  parameters: GenerationParams;
  suggestedSkills: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
```

Remove the `ClaudeModel` type alias (no longer needed). Remove `ModelInfo` interface (replaced by `ProviderModel`). Update `UserProfile.preferredModel` to `string`.

**Step 3: Verify build (will have errors — expected, we fix in subsequent tasks)**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: Type errors from files still using `ClaudeModel` — that's OK, we fix them next.

---

### Task 3: Create Provider Registry

**Files:**
- Create: `src/lib/providers/registry.ts`

**Step 1: Create the registry**

```typescript
import type { ProviderDefinition, TargetInfo } from './types';

export const PROVIDERS: ProviderDefinition[] = [
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    sdkType: 'anthropic',
    defaultBaseUrl: 'https://api.anthropic.com',
    apiKeyPrefix: '^sk-ant-',
    apiKeyPlaceholder: 'sk-ant-...',
    requiresApiKey: true,
    allowCustomBaseUrl: false,
    models: [
      {
        id: 'claude-opus-4-6',
        apiString: 'claude-opus-4-6',
        displayName: 'Claude Opus 4.6',
        description: 'Most powerful — 128K output, deep reasoning',
        maxOutputTokens: 128_000,
        contextWindow: 200_000,
      },
      {
        id: 'claude-sonnet-4-6',
        apiString: 'claude-sonnet-4-6',
        displayName: 'Claude Sonnet 4.6',
        description: 'Best balance — 64K output, great value',
        maxOutputTokens: 64_000,
        contextWindow: 200_000,
      },
      {
        id: 'claude-haiku-4-5',
        apiString: 'claude-haiku-4-5-20251001',
        displayName: 'Claude Haiku 4.5',
        description: 'Fastest — 64K output, cost-efficient',
        maxOutputTokens: 64_000,
        contextWindow: 200_000,
      },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    sdkType: 'openai-compat',
    defaultBaseUrl: 'https://api.openai.com/v1',
    apiKeyPrefix: '^sk-',
    apiKeyPlaceholder: 'sk-...',
    requiresApiKey: true,
    allowCustomBaseUrl: false,
    models: [
      {
        id: 'gpt-4o',
        apiString: 'gpt-4o',
        displayName: 'GPT-4o',
        description: 'Flagship multimodal model',
        maxOutputTokens: 16_384,
        contextWindow: 128_000,
      },
      {
        id: 'gpt-4o-mini',
        apiString: 'gpt-4o-mini',
        displayName: 'GPT-4o Mini',
        description: 'Fast and affordable',
        maxOutputTokens: 16_384,
        contextWindow: 128_000,
      },
      {
        id: 'o3-mini',
        apiString: 'o3-mini',
        displayName: 'o3-mini',
        description: 'Reasoning model — excellent for complex tasks',
        maxOutputTokens: 65_536,
        contextWindow: 200_000,
      },
    ],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    sdkType: 'openai-compat',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKeyPrefix: '^AIza',
    apiKeyPlaceholder: 'AIza...',
    requiresApiKey: true,
    allowCustomBaseUrl: false,
    models: [
      {
        id: 'gemini-2.5-pro',
        apiString: 'gemini-2.5-pro-preview-05-06',
        displayName: 'Gemini 2.5 Pro',
        description: 'Most capable Gemini model',
        maxOutputTokens: 65_536,
        contextWindow: 1_048_576,
      },
      {
        id: 'gemini-2.5-flash',
        apiString: 'gemini-2.5-flash-preview-04-17',
        displayName: 'Gemini 2.5 Flash',
        description: 'Fast and efficient',
        maxOutputTokens: 65_536,
        contextWindow: 1_048_576,
      },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    sdkType: 'openai-compat',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    apiKeyPrefix: '^sk-or-',
    apiKeyPlaceholder: 'sk-or-...',
    requiresApiKey: true,
    allowCustomBaseUrl: false,
    models: [
      {
        id: 'or-auto',
        apiString: 'openrouter/auto',
        displayName: 'Auto (Best Available)',
        description: 'OpenRouter picks the best model',
        maxOutputTokens: 16_384,
        contextWindow: 128_000,
      },
      {
        id: 'or-claude-sonnet',
        apiString: 'anthropic/claude-sonnet-4',
        displayName: 'Claude Sonnet 4 (via OR)',
        description: 'Claude via OpenRouter',
        maxOutputTokens: 64_000,
        contextWindow: 200_000,
      },
      {
        id: 'or-gpt-4o',
        apiString: 'openai/gpt-4o',
        displayName: 'GPT-4o (via OR)',
        description: 'GPT-4o via OpenRouter',
        maxOutputTokens: 16_384,
        contextWindow: 128_000,
      },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    sdkType: 'openai-compat',
    defaultBaseUrl: 'http://localhost:11434/v1',
    apiKeyPrefix: '',
    apiKeyPlaceholder: '(no key needed)',
    requiresApiKey: false,
    allowCustomBaseUrl: true,
    models: [
      {
        id: 'ollama-llama3',
        apiString: 'llama3.3',
        displayName: 'Llama 3.3',
        description: 'Meta Llama 3.3 70B',
        maxOutputTokens: 8_192,
        contextWindow: 128_000,
      },
      {
        id: 'ollama-qwen',
        apiString: 'qwen2.5',
        displayName: 'Qwen 2.5',
        description: 'Alibaba Qwen 2.5',
        maxOutputTokens: 8_192,
        contextWindow: 32_000,
      },
      {
        id: 'ollama-custom',
        apiString: '',
        displayName: 'Custom Model',
        description: 'Enter any Ollama model name',
        maxOutputTokens: 8_192,
        contextWindow: 128_000,
      },
    ],
  },
  {
    id: 'lmstudio',
    name: 'LM Studio (Local)',
    sdkType: 'openai-compat',
    defaultBaseUrl: 'http://localhost:1234/v1',
    apiKeyPrefix: '',
    apiKeyPlaceholder: '(no key needed)',
    requiresApiKey: false,
    allowCustomBaseUrl: true,
    models: [
      {
        id: 'lmstudio-loaded',
        apiString: '',
        displayName: 'Currently Loaded Model',
        description: 'Uses whichever model is loaded in LM Studio',
        maxOutputTokens: 8_192,
        contextWindow: 32_000,
      },
    ],
  },
  {
    id: 'custom',
    name: 'Custom (OpenAI-Compatible)',
    sdkType: 'openai-compat',
    defaultBaseUrl: '',
    apiKeyPrefix: '',
    apiKeyPlaceholder: 'API key (if required)',
    requiresApiKey: false,
    allowCustomBaseUrl: true,
    models: [
      {
        id: 'custom-model',
        apiString: '',
        displayName: 'Custom Model',
        description: 'Enter model name and base URL',
        maxOutputTokens: 16_384,
        contextWindow: 128_000,
      },
    ],
  },
];

export const TARGETS: TargetInfo[] = [
  { id: 'claude', displayName: 'Claude', description: 'Optimized for Anthropic Claude models' },
  { id: 'gpt', displayName: 'GPT', description: 'Optimized for OpenAI GPT models' },
  { id: 'gemini', displayName: 'Gemini', description: 'Optimized for Google Gemini models' },
  { id: 'llama', displayName: 'Llama', description: 'Optimized for Meta Llama models' },
  { id: 'universal', displayName: 'Universal', description: 'Works well with any model' },
];

// ─── Helpers ──────────────────────────────────────────────
export function getProvider(id: string): ProviderDefinition | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function getTarget(id: string): TargetInfo | undefined {
  return TARGETS.find((t) => t.id === id);
}

export function isValidProviderModel(providerId: string, modelId: string): boolean {
  const provider = getProvider(providerId);
  if (!provider) return false;
  return provider.models.some((m) => m.id === modelId);
}
```

**Step 2: Verify file compiles**

Run: `npx tsc --noEmit src/lib/providers/registry.ts 2>&1 || true`

---

### Task 4: Create Provider Adapters

**Files:**
- Create: `src/lib/providers/anthropic.ts`
- Create: `src/lib/providers/openai-compat.ts`
- Create: `src/lib/providers/index.ts`

**Step 1: Create Anthropic adapter `src/lib/providers/anthropic.ts`**

```typescript
import Anthropic from '@anthropic-ai/sdk';
import type { ProviderAdapter, StreamChunk } from './types';

/** Sanitise Anthropic SDK errors — no API keys leak to client */
function sanitizeAnthropicError(error: unknown): string {
  console.error('[anthropic-adapter] API error:', error);
  if (error instanceof Anthropic.AuthenticationError) return 'Invalid API key. Please check your Anthropic API key.';
  if (error instanceof Anthropic.RateLimitError) return 'Rate limit exceeded. Please wait and try again.';
  if (error instanceof Anthropic.PermissionDeniedError) return 'Your API key does not have permission to use this model.';
  if (error instanceof Anthropic.NotFoundError) return 'Model not found. Please choose a supported Claude model.';
  if (error instanceof Anthropic.BadRequestError) {
    const m = error.message.match(/"message"\s*:\s*"([^"]+)"/);
    return `Invalid request: ${m?.[1] ?? error.message}`;
  }
  if (error instanceof Anthropic.InternalServerError) return 'Anthropic API server error. Please retry.';
  if (error instanceof Anthropic.APIConnectionError) return 'Could not reach the Anthropic API.';
  if (error instanceof Anthropic.APIError) return `API error (${error.status ?? 'unknown'})`;
  const msg = String(error).toLowerCase();
  if (msg.includes('overloaded') || msg.includes('529')) return 'Anthropic API is temporarily overloaded.';
  if (msg.includes('timeout') || msg.includes('aborted')) return 'Request timed out.';
  return 'Generation failed. Please try again.';
}

export function createAnthropicAdapter(): ProviderAdapter {
  return {
    async *stream({ apiKey, model, system, userMessage, maxTokens }) {
      const client = new Anthropic({ apiKey });
      try {
        const stream = await client.messages.stream({
          model,
          max_tokens: maxTokens,
          system,
          messages: [{ role: 'user', content: userMessage }],
        });
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            yield { type: 'text', text: event.delta.text } satisfies StreamChunk;
          }
        }
        const final = await stream.finalMessage();
        yield { type: 'done', usage: final.usage } satisfies StreamChunk;
      } catch (err) {
        yield { type: 'error', error: sanitizeAnthropicError(err) } satisfies StreamChunk;
      }
    },
  };
}
```

**Step 2: Create OpenAI-compat adapter `src/lib/providers/openai-compat.ts`**

```typescript
import OpenAI from 'openai';
import type { ProviderAdapter, StreamChunk } from './types';

function sanitizeOpenAIError(error: unknown): string {
  console.error('[openai-compat-adapter] API error:', error);
  if (error instanceof OpenAI.AuthenticationError) return 'Invalid API key. Please check your API key.';
  if (error instanceof OpenAI.RateLimitError) return 'Rate limit exceeded. Please wait and try again.';
  if (error instanceof OpenAI.PermissionDeniedError) return 'Your API key does not have permission for this model.';
  if (error instanceof OpenAI.NotFoundError) return 'Model not found. Please check the model name.';
  if (error instanceof OpenAI.BadRequestError) return `Invalid request: ${error.message}`;
  if (error instanceof OpenAI.InternalServerError) return 'Provider API server error. Please retry.';
  if (error instanceof OpenAI.APIConnectionError) return 'Could not reach the provider API. Check the base URL.';
  if (error instanceof OpenAI.APIError) return `API error (${error.status ?? 'unknown'})`;
  const msg = String(error).toLowerCase();
  if (msg.includes('econnrefused')) return 'Connection refused. Is the local server running?';
  if (msg.includes('timeout') || msg.includes('aborted')) return 'Request timed out.';
  return 'Generation failed. Please try again.';
}

export function createOpenAICompatAdapter(): ProviderAdapter {
  return {
    async *stream({ apiKey, model, system, userMessage, maxTokens, baseUrl }) {
      const client = new OpenAI({
        apiKey: apiKey || 'not-needed',
        baseURL: baseUrl,
      });
      try {
        const stream = await client.chat.completions.create({
          model,
          max_tokens: maxTokens,
          stream: true,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: userMessage },
          ],
        });
        let totalTokens = 0;
        for await (const chunk of stream) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) {
            yield { type: 'text', text: delta } satisfies StreamChunk;
          }
          if (chunk.usage) {
            totalTokens = chunk.usage.total_tokens ?? 0;
          }
        }
        yield {
          type: 'done',
          usage: { input_tokens: 0, output_tokens: totalTokens },
        } satisfies StreamChunk;
      } catch (err) {
        yield { type: 'error', error: sanitizeOpenAIError(err) } satisfies StreamChunk;
      }
    },
  };
}
```

**Step 3: Create barrel export `src/lib/providers/index.ts`**

```typescript
export { createAnthropicAdapter } from './anthropic';
export { createOpenAICompatAdapter } from './openai-compat';
export { PROVIDERS, TARGETS, getProvider, getTarget, isValidProviderModel } from './registry';
export type { ProviderId, TargetId, SdkType, ProviderDefinition, ProviderModel, ProviderAdapter, StreamChunk, TargetInfo } from './types';
```

**Step 4: Commit**

```bash
git add src/lib/providers/
git commit -m "feat: add provider abstraction layer with Anthropic + OpenAI adapters"
```

---

### Task 5: Update Constants and Store for Multi-Provider

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/store/use-forge-store.ts`

**Step 1: Update `src/lib/constants.ts`**

Replace the old `MODELS` array export with a re-export from providers, keep FORMATS as-is. Remove old `ModelInfo` imports. Update defaults:

```typescript
import type { FormatInfo } from './types';
import { PROVIDERS, TARGETS } from './providers/registry';
import type { ProviderId, TargetId } from './providers/types';

// Re-export provider data
export { PROVIDERS, TARGETS };

export const FORMATS: FormatInfo[] = [ /* keep existing array unchanged */ ];

export const DEFAULT_PROVIDER: ProviderId = 'anthropic';
export const DEFAULT_TARGET: TargetId = 'claude';
export const DEFAULT_MODEL = 'claude-sonnet-4-6';
export const DEFAULT_FORMAT = 'xml' as const;
export const DEFAULT_EFFORT = 'medium' as const;
export const DEFAULT_MAX_TOKENS = 4096;

// ── Runtime type guards ──────────────────────────────────
export function isValidFormat(value: string): value is import('./types').PromptFormat {
  return FORMATS.some((f) => f.id === value);
}

export const APP_NAME = 'ClaudeForge';
export const APP_DESCRIPTION = 'Craft perfect AI prompts from plain English — supports Claude, GPT, Gemini, Llama & more';
export const APP_VERSION = '0.2.0';
```

Remove the old `MODELS`, `isValidModel`, and `ModelInfo` import.

**Step 2: Update `src/store/use-forge-store.ts`**

Add provider, target, customBaseUrl, customModelName fields:

- Import `ProviderId, TargetId` from providers
- Import `DEFAULT_PROVIDER, DEFAULT_TARGET` from constants
- Add to `ForgeState` interface:
  ```
  provider: ProviderId;
  target: TargetId;
  customBaseUrl: string;
  customModelName: string;
  setProvider: (p: ProviderId) => void;
  setTarget: (t: TargetId) => void;
  setCustomBaseUrl: (url: string) => void;
  setCustomModelName: (name: string) => void;
  ```
- Add to store defaults: `provider: DEFAULT_PROVIDER`, `target: DEFAULT_TARGET`, `customBaseUrl: ''`, `customModelName: ''`
- Add setters
- Add provider/target to `partialize` persist list
- Update `model` type from `ClaudeModel` to `string`

**Step 3: Verify build**

Run: `npx tsc --noEmit 2>&1 | head -40`

**Step 4: Commit**

```bash
git add src/lib/constants.ts src/store/use-forge-store.ts src/lib/types.ts
git commit -m "feat: update store and constants for multi-provider support"
```

---

### Task 6: Refactor API Route

**Files:**
- Modify: `src/app/api/generate/route.ts`

**Step 1: Rewrite the route to use provider abstraction**

Key changes:
- Accept `provider`, `target`, `customBaseUrl`, `customModelName` in request body
- Validate provider + model against registry
- Resolve the correct adapter (Anthropic or OpenAI-compat)
- Pass target to meta-prompt builder
- Stream response using the adapter's async iterable

The rate limiter and SSE response format stay the same. The adapter swap replaces the direct Anthropic SDK instantiation.

**Step 2: Verify build**

Run: `npm run build`
Expected: Build passes

**Step 3: Commit**

```bash
git add src/app/api/generate/route.ts
git commit -m "feat: refactor API route to use provider abstraction"
```

---

### Task 7: Update Meta-Prompt Builder for Targets

**Files:**
- Modify: `src/lib/engine/meta-prompt-builder.ts`
- Modify: `src/lib/engine/model-context.ts`

**Step 1: Update `buildMetaPrompt` to accept target**

- Change `params` to include `target` and `provider`
- Update system prompt intro: "You are ClaudeForge, an expert prompt engineer specializing in crafting production-ready prompts for AI models" (not just Claude)
- Add target-specific context block based on `target` value (claude, gpt, gemini, llama, universal)
- Keep skill summary, format instructions unchanged

**Step 2: Update `model-context.ts` to work with any model**

- Change function signature from `getModelContext(model: ClaudeModel)` to `getModelContext(provider: string, model: string)`
- Return generic context for non-Claude models based on provider registry data
- Keep detailed Claude-specific context for Anthropic models

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/lib/engine/
git commit -m "feat: make meta-prompt builder target-aware"
```

---

### Task 8: Update use-generate Hook

**Files:**
- Modify: `src/hooks/use-generate.ts`

**Step 1: Update the hook to send provider info**

- Add `provider`, `target`, `customBaseUrl`, `customModelName` to the request body
- Update validation: check for API key only if provider requires one
- Update params object sent to API

**Step 2: Commit**

```bash
git add src/hooks/use-generate.ts
git commit -m "feat: update generate hook for multi-provider"
```

---

### Task 9: Build Provider Selector Component

**Files:**
- Create: `src/components/forge/provider-selector.tsx`

**Step 1: Create the component**

A shadcn Select dropdown showing all providers grouped visually:
- Cloud providers: Anthropic, OpenAI, Gemini, OpenRouter
- Local providers: Ollama, LM Studio
- Custom: Custom OpenAI-Compatible

When provider changes, auto-set the first model for that provider.
When provider is ollama/lmstudio/custom, show a URL input below.

**Step 2: Commit**

```bash
git add src/components/forge/provider-selector.tsx
git commit -m "feat: add provider selector component"
```

---

### Task 10: Build Target Selector Component

**Files:**
- Create: `src/components/forge/target-selector.tsx`

**Step 1: Create the component**

A shadcn Select for target model family (Claude, GPT, Gemini, Llama, Universal).
Simple select with descriptions.

**Step 2: Commit**

```bash
git add src/components/forge/target-selector.tsx
git commit -m "feat: add target selector component"
```

---

### Task 11: Update Model Selector, Config Bar, API Key Input

**Files:**
- Modify: `src/components/forge/model-selector.tsx`
- Modify: `src/components/forge/config-bar.tsx`
- Modify: `src/components/forge/api-key-input.tsx`

**Step 1: Update ModelSelector to filter by provider**

- Read `provider` from store
- Look up provider definition, show only that provider's models
- For ollama/lmstudio with custom model, show a text input
- For custom provider, show text input for model name

**Step 2: Update ConfigBar layout**

Add Provider and Target selectors at the start:

```
Provider | Model | Target | Format | Thinking | Effort | Max Tokens
```

Use responsive grid: on mobile, Provider/Model/Target stack on the first row, rest on second. Use `grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap`.

**Step 3: Update ApiKeyInput**

- Read provider from store
- Get provider definition for key validation and placeholder
- If provider doesn't require API key, show "(no API key needed)" text
- Update validation regex to use provider's `apiKeyPrefix`
- Update placeholder text from provider definition

**Step 4: Verify build**

Run: `npm run build`

**Step 5: Commit**

```bash
git add src/components/forge/
git commit -m "feat: update UI components for multi-provider support"
```

---

### Task 12: Update Hero Section and Input Panel

**Files:**
- Modify: `src/components/forge/hero-section.tsx`
- Modify: `src/components/forge/input-panel.tsx`

**Step 1: Update hero text**

Change "Craft perfect Claude prompts" to "Craft perfect AI prompts" and subtitle to mention "Claude, GPT, Gemini, Llama & more".

**Step 2: Update input panel placeholder**

Change "Describe what you want Claude to do..." to "Describe what you want your AI to do..."

**Step 3: Commit**

```bash
git add src/components/forge/hero-section.tsx src/components/forge/input-panel.tsx
git commit -m "feat: update hero and input panel for multi-provider"
```

---

### Task 13: Fix Auth Error

**Files:**
- Modify: `src/components/auth/auth-button.tsx`

**Step 1: Handle "Error getting user profile from external provider"**

In `handleSignIn`, add specific handling for profile fetch errors:
- If error message includes "profile" or "provider", show a helpful toast explaining the user should check their Supabase GitHub OAuth configuration
- Make the error non-blocking — user can still use the app without auth

**Step 2: Commit**

```bash
git add src/components/auth/auth-button.tsx
git commit -m "fix: handle auth profile fetch errors gracefully"
```

---

### Task 14: Responsive Design Audit

**Files:**
- Modify: `src/components/forge/config-bar.tsx` (already updated in Task 11)
- Modify: `src/components/layout/header.tsx`

**Step 1: Audit header at mobile widths**

Ensure header items don't overflow. Nav links should collapse to icon-only at `sm` breakpoint. AuthButton stays visible.

**Step 2: Audit config bar wrapping**

Already using grid in Task 11. Verify items wrap cleanly at 375px width.

**Step 3: Commit**

```bash
git add src/components/layout/header.tsx src/components/forge/config-bar.tsx
git commit -m "fix: improve responsive design for mobile viewports"
```

---

### Task 15: Final Build Verification and Push

**Step 1: Full build**

Run: `npm run build`
Expected: Build succeeds with zero errors

**Step 2: Lint check**

Run: `npm run lint`
Expected: No errors

**Step 3: Final commit and push**

```bash
git add -A
git status
git commit -m "feat: multi-provider AI support — Claude, GPT, Gemini, Ollama, LM Studio & more"
git push origin main
```
