// Shared types for Image Prompt Optimizer
// Extracted from App.tsx to avoid circular imports

export interface ClarificationAnswer {
  question: string
  answer: string
}

export interface OptimizationResult {
  optimizedPrompt: string
  negativePrompt: string
  modelAdvice: string
  clarificationQuestions?: string[]
  _mock?: boolean
  _notice?: string
}
