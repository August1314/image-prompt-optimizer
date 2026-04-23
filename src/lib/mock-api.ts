import type { Connect } from 'vite'
import type { ClarificationAnswer } from './types'

/**
 * Deterministic mock API for local development without an OpenAI API key.
 * Returns realistic-looking placeholder responses that follow the same schema
 * as the real API, so the UI flow can be tested end-to-end.
 */

function mockClarification(prompt: string) {
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

function mockOptimizedPrompt(prompt: string, answers: ClarificationAnswer[]) {
  const answersSummary = answers.map((a) => a.answer).join(', ')
  const optimized = `A highly detailed ${prompt}, ${answersSummary}, dramatic lighting, intricate details, professional composition, 8K resolution, masterpiece quality`
  const negative = 'blurry, low quality, distorted, deformed, ugly, bad anatomy, extra limbs, watermark, text, signature, oversaturated, cropped, worst quality, low resolution'
  const modelAdvice = 'This prompt works well with Midjourney v6 using --ar 16:9 --v 6.0. For DALL-E 3, keep the description as-is. For Stable Diffusion, consider adding "score_9, score_8_up" quality tags.'

  return {
    optimizedPrompt: optimized,
    negativePrompt: negative,
    modelAdvice: modelAdvice,
    clarificationQuestions: [],
  }
}

export function mockApiMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (req.url !== '/api/optimize' || req.method !== 'POST') {
      return next()
    }

    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body)
        const prompt: string = parsed.prompt || ''
        const answers: ClarificationAnswer[] = parsed.answers || []

        const isFirstPass = !answers || answers.length === 0 || answers.every((a: ClarificationAnswer) => !a.answer?.trim())
        const result = isFirstPass ? mockClarification(prompt) : mockOptimizedPrompt(prompt, answers)

        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end(JSON.stringify(result))
      } catch {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Invalid JSON body.' }))
      }
    })
  }
}
