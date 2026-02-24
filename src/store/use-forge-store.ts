import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ClaudeModel, PromptFormat, EffortLevel, GenerationResult } from '@/lib/types';
import { DEFAULT_MODEL, DEFAULT_FORMAT, DEFAULT_EFFORT, DEFAULT_MAX_TOKENS } from '@/lib/constants';

interface ForgeState {
  // ─── API Key ──────────────────────────────────────────
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;

  // ─── Configuration ────────────────────────────────────
  model: ClaudeModel;
  format: PromptFormat;
  enableThinking: boolean;
  effort: EffortLevel;
  maxTokens: number;
  setModel: (model: ClaudeModel) => void;
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
      // API Key
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      clearApiKey: () => set({ apiKey: '' }),

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
        apiKey: state.apiKey,
        model: state.model,
        format: state.format,
        enableThinking: state.enableThinking,
        effort: state.effort,
        maxTokens: state.maxTokens,
      }),
    }
  )
);
