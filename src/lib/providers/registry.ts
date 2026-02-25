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
        description: 'Reasoning model — complex tasks',
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
        apiString: 'gemini-2.5-pro',
        displayName: 'Gemini 2.5 Pro',
        description: 'Most capable — deep reasoning, 1M context',
        maxOutputTokens: 65_536,
        contextWindow: 1_048_576,
      },
      {
        id: 'gemini-2.5-flash',
        apiString: 'gemini-2.5-flash',
        displayName: 'Gemini 2.5 Flash',
        description: 'Best value — fast reasoning, 1M context',
        maxOutputTokens: 65_536,
        contextWindow: 1_048_576,
      },
      {
        id: 'gemini-2.5-flash-lite',
        apiString: 'gemini-2.5-flash-lite',
        displayName: 'Gemini 2.5 Flash Lite',
        description: 'Fastest — budget-friendly, high volume',
        maxOutputTokens: 65_536,
        contextWindow: 1_048_576,
      },
      {
        id: 'gemini-2.0-flash',
        apiString: 'gemini-2.0-flash',
        displayName: 'Gemini 2.0 Flash',
        description: 'Previous gen — stable, well-tested',
        maxOutputTokens: 8_192,
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
