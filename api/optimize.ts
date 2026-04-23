import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'
import { checkServerSafety } from '../src/lib/safety.server'
import { runMockOptimizer } from '../src/lib/mock-optimizer'
import type { ClarificationAnswer } from '../src/lib/types'

interface OptimizeRequest {
  prompt: string
  answers: ClarificationAnswer[]
}

function hasAnswers(answers: unknown[]): answers is ClarificationAnswer[] {
  if (!Array.isArray(answers)) return false
  return answers.every(
    (a) =>
      typeof a === 'object' &&
      a !== null &&
      typeof (a as ClarificationAnswer).question === 'string' &&
      typeof (a as ClarificationAnswer).answer === 'string'
  )
}

function isOptimizeRequest(body: unknown): body is OptimizeRequest {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  return typeof b.prompt === 'string' && Array.isArray(b.answers)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  if (!isOptimizeRequest(req.body)) {
    return res.status(400).json({ error: 'Invalid request body. Expected { prompt: string, answers: array }.' })
  }

  const { prompt, answers } = req.body

  // Server-side safety check
  const fullText = `${prompt} ${answers.map((a) => a.answer).join(' ')}`
  const safetyResult = checkServerSafety(fullText)
  if (!safetyResult.safe) {
    return res.status(422).json({ error: safetyResult.reason })
  }

  // If no OPENAI_API_KEY is configured, fall back to deterministic mock responses.
  // This allows the app to remain functional in preview environments or when
  // the key has not yet been provisioned, while clearly signaling mock mode.
  if (!process.env.OPENAI_API_KEY) {
    const result = runMockOptimizer(prompt, answers)
    return res.status(200).json({
      ...result,
      _mock: true,
      _notice: 'Running in mock mode because OPENAI_API_KEY is not configured. Set the environment variable to enable real AI optimization.',
    })
  }

  try {
    const isFirstPass = !hasAnswers(answers) || answers.length === 0 || answers.every((a) => !a.answer.trim())

    if (isFirstPass) {
      // Generate clarification questions
      const systemPrompt = `You are an expert AI image prompt optimizer. Your job is to help users craft the best possible prompts for AI image generators (like Midjourney, DALL-E 3, Stable Diffusion, etc.).

Given a rough image idea from the user, generate 2-4 focused clarification questions that will help you craft a better prompt. Ask about:
- Art style preferences (realistic, anime, oil painting, watercolor, etc.)
- Color palette or mood
- Composition or camera angle
- Specific details they want emphasized
- Any characters or subjects in detail

Respond ONLY with valid JSON in this exact format, no markdown or extra text:
{
  "clarificationQuestions": ["question1", "question2", "question3"]
}

If the user's idea is already very detailed and specific enough, you may return an empty array for clarificationQuestions.`

      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `My image idea: ${prompt}` },
        ],
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content || '{}'
      const parsed = JSON.parse(content)

      return res.status(200).json({
        optimizedPrompt: '',
        negativePrompt: '',
        modelAdvice: '',
        clarificationQuestions: parsed.clarificationQuestions || [],
      })
    } else {
      // Generate the optimized prompt
      const systemPrompt = `You are an expert AI image prompt optimizer. You help users create the best prompts for AI image generators.

Given the user's original idea and their answers to clarification questions, generate:

1. **optimizedPrompt**: A detailed, well-structured prompt optimized for AI image generators. Use specific, descriptive language. Include style, composition, lighting, mood, and technical details. Format it as a single continuous prompt.

2. **negativePrompt**: Things the AI should avoid generating. Common negative prompt elements include: blurry, low quality, distorted, deformed, ugly, bad anatomy, extra limbs, watermark, text, signature. Add specific negatives based on the user's concept.

3. **modelAdvice**: Brief advice on which AI model and settings to use (e.g., "Best with Midjourney v6 at --ar 16:9" or "Use DALL-E 3 with detailed description for best results"). Keep it 2-3 sentences.

Respond ONLY with valid JSON in this exact format, no markdown or extra text:
{
  "optimizedPrompt": "...",
  "negativePrompt": "...",
  "modelAdvice": "..."
}`

      const answersText = answers
        .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
        .join('\n\n')

      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `My image idea: ${prompt}\n\nMy answers:\n${answersText}`,
          },
        ],
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content || '{}'
      const parsed = JSON.parse(content)

      return res.status(200).json({
        optimizedPrompt: parsed.optimizedPrompt || '',
        negativePrompt: parsed.negativePrompt || '',
        modelAdvice: parsed.modelAdvice || '',
        clarificationQuestions: [],
      })
    }
  } catch (err) {
    console.error('Optimization error:', err)

    if (err instanceof OpenAI.APIError) {
      return res.status(502).json({
        error: `AI service error: ${err.message}`,
      })
    }

    return res.status(500).json({ error: 'An unexpected error occurred. Please try again.' })
  }
}
