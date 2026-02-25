import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PromptFormat, EffortLevel, GenerationResult, ProviderId, TargetId } from '@/lib/types';
import {
  DEFAULT_PROVIDER,
  DEFAULT_MODEL,
  DEFAULT_TARGET,
  DEFAULT_FORMAT,
  DEFAULT_EFFORT,
  DEFAULT_MAX_TOKENS,
} from '@/lib/constants';

// ─── Per-provider session-scoped API key storage ────────
// Each provider gets its own sessionStorage key: cf-ak-{providerId}
// Keys are cleared when the browser tab closes (session scope).
const SESSION_KEY_PREFIX = 'cf-ak-';

/** Read the API key for a specific provider from sessionStorage */
function loadApiKeyForProvider(providerId: string): string {
  if (typeof window === 'undefined') return '';
  try {
    return sessionStorage.getItem(`${SESSION_KEY_PREFIX}${providerId}`) ?? '';
  } catch {
    return '';
  }
}

/** Save the API key for a specific provider to sessionStorage */
function saveApiKeyForProvider(providerId: string, key: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (key) sessionStorage.setItem(`${SESSION_KEY_PREFIX}${providerId}`, key);
    else sessionStorage.removeItem(`${SESSION_KEY_PREFIX}${providerId}`);
  } catch {
    // sessionStorage may be unavailable
  }
}

/**
 * One-time migration: move old single API key from the legacy
 * `cf-ak` sessionStorage entry (or localStorage persist store)
 * to the new per-provider format under the Anthropic provider,
 * since the old app only supported Anthropic.
 */
function migrateOldApiKey(): void {
  if (typeof window === 'undefined') return;
  try {
    // Check if migration was already done
    if (sessionStorage.getItem('cf-ak-migrated')) return;

    // Migrate from old single sessionStorage key
    const oldSessionKey = sessionStorage.getItem('cf-ak');
    if (oldSessionKey) {
      saveApiKeyForProvider('anthropic', oldSessionKey);
      sessionStorage.removeItem('cf-ak');
    }

    // Migrate from old localStorage persist store
    const stored = localStorage.getItem('claudeforge-config');
    if (stored) {
      const parsed = JSON.parse(stored);
      const oldKey = parsed?.state?.apiKey;
      if (oldKey && typeof oldKey === 'string') {
        saveApiKeyForProvider('anthropic', oldKey);
        delete parsed.state.apiKey;
        localStorage.setItem('claudeforge-config', JSON.stringify(parsed));
      }
    }

    sessionStorage.setItem('cf-ak-migrated', '1');
  } catch {
    // Ignore migration errors
  }
}

// ─── Store interface ─────────────────────────────────────
interface ForgeState {
  // ─── API Key ──────────────────────────────────────────
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  hydrateApiKey: () => void;

  // ─── Provider + Target ─────────────────────────────────
  provider: ProviderId;
  target: TargetId;
  customBaseUrl: string;
  customModelName: string;
  setProvider: (provider: ProviderId) => void;
  setTarget: (target: TargetId) => void;
  setCustomBaseUrl: (url: string) => void;
  setCustomModelName: (name: string) => void;

  // ─── Configuration ────────────────────────────────────
  model: string;
  format: PromptFormat;
  enableThinking: boolean;
  effort: EffortLevel;
  maxTokens: number;
  setModel: (model: string) => void;
  setFormat: (format: PromptFormat) => void;
  setEnableThinking: (enabled: boolean) => void;
  setEffort: (effort: EffortLevel) => void;
  setMaxTokens: (tokens: number) => void;

  // ─── Input ────────────────────────────────────────────
  inputText: string;
  setInputText: (text: string) => void;

  // ─── Generation State ─────────────────────────────────
  isGenerating: boolean;
  result: GenerationResult | null;
  error: string | null;
  setIsGenerating: (generating: boolean) => void;
  setResult: (result: GenerationResult | null) => void;
  setError: (error: string | null) => void;

  // ─── Active Format Tab ────────────────────────────────
  activeOutputFormat: PromptFormat;
  setActiveOutputFormat: (format: PromptFormat) => void;
}

export const useForgeStore = create<ForgeState>()(
  persist(
    (set, get) => ({
      // API Key — synced to sessionStorage PER PROVIDER (cleared on tab close)
      apiKey: '',
      setApiKey: (key) => {
        // Save to the current provider's slot in sessionStorage
        saveApiKeyForProvider(get().provider, key);
        set({ apiKey: key });
      },
      clearApiKey: () => {
        saveApiKeyForProvider(get().provider, '');
        set({ apiKey: '' });
      },
      hydrateApiKey: () => {
        // Run one-time migration from old single-key format
        migrateOldApiKey();
        // Load key for the current provider
        const key = loadApiKeyForProvider(get().provider);
        set({ apiKey: key });
      },

      // Provider + Target
      provider: DEFAULT_PROVIDER,
      target: DEFAULT_TARGET,
      customBaseUrl: '',
      customModelName: '',
      setProvider: (provider) => {
        const currentState = get();
        // Save current provider's API key before switching
        saveApiKeyForProvider(currentState.provider, currentState.apiKey);
        // Load the new provider's API key
        const newKey = loadApiKeyForProvider(provider);
        set({ provider, apiKey: newKey });
      },
      setTarget: (target) => set({ target }),
      setCustomBaseUrl: (customBaseUrl) => set({ customBaseUrl }),
      setCustomModelName: (customModelName) => set({ customModelName }),

      // Configuration
      model: DEFAULT_MODEL,
      format: DEFAULT_FORMAT,
      enableThinking: false,
      effort: DEFAULT_EFFORT,
      maxTokens: DEFAULT_MAX_TOKENS,
      setModel: (model) => set({ model }),
      setFormat: (format) => set({ format, activeOutputFormat: format }),
      setEnableThinking: (enableThinking) => set({ enableThinking }),
      setEffort: (effort) => set({ effort }),
      setMaxTokens: (maxTokens) => set({ maxTokens }),

      // Input
      inputText: '',
      setInputText: (inputText) => set({ inputText }),

      // Generation State
      isGenerating: false,
      result: null,
      error: null,
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setResult: (result) => set({ result, error: null }),
      setError: (error) => set({ error }),

      // Active Format Tab
      activeOutputFormat: DEFAULT_FORMAT,
      setActiveOutputFormat: (activeOutputFormat) => set({ activeOutputFormat }),
    }),
    {
      name: 'claudeforge-config',
      partialize: (state) => ({
        // Security: apiKey is intentionally EXCLUDED — stored in sessionStorage instead
        provider: state.provider,
        model: state.model,
        target: state.target,
        customBaseUrl: state.customBaseUrl,
        customModelName: state.customModelName,
        format: state.format,
        enableThinking: state.enableThinking,
        effort: state.effort,
        maxTokens: state.maxTokens,
      }),
      onRehydrateStorage: () => (state) => {
        // After localStorage config hydration, also hydrate API key from sessionStorage
        state?.hydrateApiKey();
      },
    }
  )
);
