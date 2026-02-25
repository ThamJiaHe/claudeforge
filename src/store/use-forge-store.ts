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

// ─── Session-scoped API key storage ──────────────────────
const SESSION_KEY = 'cf-ak';

/**
 * Load API key from sessionStorage, migrating from localStorage
 * if the user stored a key there before this security fix.
 */
function loadApiKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    const sessionVal = sessionStorage.getItem(SESSION_KEY);
    if (sessionVal) return sessionVal;

    // One-time migration: move key from old localStorage persist store
    const stored = localStorage.getItem('claudeforge-config');
    if (stored) {
      const parsed = JSON.parse(stored);
      const oldKey = parsed?.state?.apiKey;
      if (oldKey && typeof oldKey === 'string') {
        sessionStorage.setItem(SESSION_KEY, oldKey);
        delete parsed.state.apiKey;
        localStorage.setItem('claudeforge-config', JSON.stringify(parsed));
        return oldKey;
      }
    }
  } catch {
    // Ignore storage errors
  }
  return '';
}

function saveApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (key) sessionStorage.setItem(SESSION_KEY, key);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // sessionStorage may be unavailable
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
    (set) => ({
      // API Key — synced to sessionStorage (cleared on tab close), NOT localStorage
      apiKey: '',
      setApiKey: (key) => {
        saveApiKey(key);
        set({ apiKey: key });
      },
      clearApiKey: () => {
        saveApiKey('');
        set({ apiKey: '' });
      },
      hydrateApiKey: () => set({ apiKey: loadApiKey() }),

      // Provider + Target
      provider: DEFAULT_PROVIDER,
      target: DEFAULT_TARGET,
      customBaseUrl: '',
      customModelName: '',
      setProvider: (provider) => set({ provider }),
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
