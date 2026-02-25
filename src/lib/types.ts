import type { ProviderId, TargetId } from './providers/types';

// ─── Format Types ───────────────────────────────────────
export type PromptFormat =
  | 'xml'
  | 'toon'
  | 'harness'
  | 'markdown'
  | 'plaintext'
  | 'json'
  | 'yaml'
  | 'claudemd'
  | 'system-user-split';

export interface FormatInfo {
  id: PromptFormat;
  displayName: string;
  description: string;
  fileExtension: string;
  syntaxLanguage: string; // for Shiki highlighting
}

// ─── Parameter Types ────────────────────────────────────
export type EffortLevel = 'low' | 'medium' | 'high' | 'max';

export interface GenerationParams {
  provider: ProviderId;
  model: string;
  target: TargetId;
  format: PromptFormat;
  enableThinking: boolean;
  effort: EffortLevel;
  maxTokens: number;
  customBaseUrl?: string;
  customModelName?: string;
}

// ─── Generation Types ───────────────────────────────────
export interface GenerationRequest {
  text: string;
  params: GenerationParams;
  apiKey: string;
}

export interface GenerationResult {
  prompt: string;
  structuredData: Record<string, string>; // for format conversion
  suggestedSkills: SkillSuggestion[];
  parameterTips: string[];
  model: string;
  format: PromptFormat;
}

// ─── Skill Types ────────────────────────────────────────
export interface SkillSuggestion {
  id: string;
  name: string;
  category: string;
  description: string;
  relevance: number; // 0-1 confidence score
}

export interface SkillRegistryEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  keywords: string[];
}

// ─── History Types ──────────────────────────────────────
export interface PromptHistoryEntry {
  id: string;
  title: string;
  inputText: string;
  outputPrompt: string;
  model: string;
  format: PromptFormat;
  parameters: GenerationParams;
  suggestedSkills: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── User Types ─────────────────────────────────────────
export interface UserProfile {
  id: string;
  displayName: string | null;
  preferredModel: string;
  preferredFormat: PromptFormat;
  theme: 'light' | 'dark' | 'system';
}

// ─── Re-export provider types for convenience ───────────
export type { ProviderId, TargetId } from './providers/types';
