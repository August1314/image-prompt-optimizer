// Shared types for Image Prompt Optimizer
// Extracted from App.tsx to avoid circular imports

export interface ClarificationAnswer {
  question: string
  answer: string
}

export type AIProvider = 'openai' | 'gemini'

export interface ProviderConfig {
  provider: AIProvider
  apiKey?: string
  model?: string
}

export interface OptimizeRequestPayload {
  prompt: string
  answers: ClarificationAnswer[]
  providerConfig?: ProviderConfig
}

export interface OptimizationResult {
  optimizedPrompt: string
  negativePrompt: string
  modelAdvice: string
  clarificationQuestions?: string[]
  _mock?: boolean
  _notice?: string
  _provider?: AIProvider
  _model?: string
}
