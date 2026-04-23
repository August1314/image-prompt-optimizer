import type { ClarificationAnswer, OptimizationResult } from './types'

/**
 * Deterministic mock optimizer for local development and fallback scenarios.
 * Returns realistic-looking placeholder responses that follow the same schema
 * as the real OpenAI-backed API, so the UI flow can be tested end-to-end.
 */

function mockClarification(prompt: string): OptimizationResult {
  const lower = prompt.toLowerCase()

  const questions: string[] = []

  if (/landscape|city|scene|world|environment/i.test(lower)) {
    questions.push('What is the primary lighting condition? (e.g., golden hour, overcast, neon-lit, moonlit)')
  }
  if (/person|figure|character|portrait|girl|boy|man|woman/i.test(lower)) {
    questions.push('Describe the art style you prefer for the character. (e.g., hyperrealistic, anime, oil painting, watercolor)')
  }
  questions.push('What color palette or mood are you aiming for? (e.g., warm and vibrant, cool and muted, dark and dramatic)')

  if (!/style|art|painting|render/i.test(lower)) {
    questions.push('Do you have a preferred visual style? (e.g., photorealistic, illustration, concept art, pixel art)')
  }

  return {
    optimizedPrompt: '',
    negativePrompt: '',
    modelAdvice: '',
    clarificationQuestions: questions.slice(0, 3),
  }
}

function mockOptimizedPrompt(prompt: string, answers: ClarificationAnswer[]): OptimizationResult {
  const answersSummary = answers.map((a) => a.answer).join(', ')
  const optimized = `A highly detailed ${prompt}, ${answersSummary}, dramatic lighting, intricate details, professional composition, 8K resolution, masterpiece quality`
  const negative = 'blurry, low quality, distorted, deformed, ugly, bad anatomy, extra limbs, watermark, text, signature, oversaturated, cropped, worst quality, low resolution'
  const modelAdvice = 'Midjourney: works great with --ar 16:9 --v 6.0 — add cinematic lighting tags for best results. | DALL-E 3: keep descriptions concise and natural-language style. | Stable Diffusion: append quality tags like "score_9, score_8_up, masterpiece" for SDXL. | Flux: use detailed, structured descriptions with style keywords.'

  return {
    optimizedPrompt: optimized,
    negativePrompt: negative,
    modelAdvice: modelAdvice,
    clarificationQuestions: [],
  }
}

export function runMockOptimizer(prompt: string, answers: ClarificationAnswer[]): OptimizationResult {
  const isFirstPass = answers.length === 0 || answers.every((a) => !a.answer.trim())
  return isFirstPass ? mockClarification(prompt) : mockOptimizedPrompt(prompt, answers)
}
