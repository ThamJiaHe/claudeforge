// ─── Model Types ────────────────────────────────────────
export type ClaudeModel = 'claude-opus-4-6' | 'claude-sonnet-4-6' | 'claude-haiku-4-5';

export interface ModelInfo {
  id: ClaudeModel;
  apiString: string;
  displayName: string;
  description: string;
  supportsThinking: boolean;
  supportsAdaptiveThinking: boolean;
  supportsEffortMax: boolean;
  maxOutputTokens: number;
  contextWindow: number;
  inputPricePer1M: number;
  outputPricePer1M: number;
}

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
  model: ClaudeModel;
  format: PromptFormat;
  enableThinking: boolean;
  effort: EffortLevel;
  maxTokens: number;
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
  model: ClaudeModel;
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
  model: ClaudeModel;
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
  preferredModel: ClaudeModel;
  preferredFormat: PromptFormat;
  theme: 'light' | 'dark' | 'system';
}
