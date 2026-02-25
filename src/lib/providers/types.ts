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
  id: string;
  apiString: string;
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
  apiKeyPrefix: string;
  apiKeyPlaceholder: string;
  requiresApiKey: boolean;
  allowCustomBaseUrl: boolean;
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
    /** Display name of the selected provider (for user-facing error messages) */
    providerName?: string;
  }): AsyncIterable<StreamChunk>;
}
