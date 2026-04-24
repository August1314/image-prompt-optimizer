import OpenAI from 'openai'
import { runMockOptimizer } from './mock-optimizer'
import { getProviderDefinition, getResolvedModel, isAIProvider, normalizeProviderConfig } from './providers'
import { checkServerSafety } from './safety.server'
import type { ClarificationAnswer, OptimizeRequestPayload, OptimizationResult, ProviderConfig } from './types'

type EnvironmentKeys = Partial<Record<'OPENAI_API_KEY' | 'GEMINI_API_KEY', string | undefined>>
const AI_REQUEST_TIMEOUT_MS = 20_000
const AI_HARD_TIMEOUT_MS = 8_000

interface RunOptimizationOptions {
  env?: EnvironmentKeys
  allowEnvKeyFallback?: boolean
  recoverWithMockOnUnavailable?: boolean
}

interface TestProviderOptions {
  providerConfig: ProviderConfig
}

export class OptimizationCoreError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'OptimizationCoreError'
  }
}

class AIRequestTimeoutError extends Error {
  constructor(message = 'AI request timed out.') {
    super(message)
    this.name = 'AIRequestTimeoutError'
  }
}

export function hasAnswers(answers: unknown[]): answers is ClarificationAnswer[] {
  if (!Array.isArray(answers)) return false
  return answers.every(
    (answer) =>
      typeof answer === 'object' &&
      answer !== null &&
      typeof (answer as ClarificationAnswer).question === 'string' &&
      typeof (answer as ClarificationAnswer).answer === 'string',
  )
}

export function isProviderConfig(value: unknown): value is ProviderConfig {
  if (typeof value !== 'object' || value === null) return false

  const config = value as Record<string, unknown>

  if ('provider' in config && config.provider !== undefined && !isAIProvider(config.provider)) {
    return false
  }

  if ('apiKey' in config && config.apiKey !== undefined && typeof config.apiKey !== 'string') {
    return false
  }

  if ('model' in config && config.model !== undefined && typeof config.model !== 'string') {
    return false
  }

  return true
}

export function isOptimizeRequestPayload(body: unknown): body is OptimizeRequestPayload {
  if (typeof body !== 'object' || body === null) return false
  const candidate = body as Record<string, unknown>

  return (
    typeof candidate.prompt === 'string' &&
    Array.isArray(candidate.answers) &&
    hasAnswers(candidate.answers) &&
    (!('providerConfig' in candidate) ||
      candidate.providerConfig === undefined ||
      isProviderConfig(candidate.providerConfig))
  )
}

function getClarificationSystemPrompt() {
  return `You are an expert AI image prompt optimizer. Your job is to help users craft the best possible prompts for AI image generators (like Midjourney, DALL-E 3, Stable Diffusion, etc.).

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
}

function getOptimizationSystemPrompt() {
  return `You are an expert AI image prompt optimizer. You help users create the best prompts for AI image generators.

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
}

function getResolvedProviderConfig(
  config: ProviderConfig,
  env: EnvironmentKeys,
  allowEnvKeyFallback: boolean,
) {
  const normalized = normalizeProviderConfig(config)
  const definition = getProviderDefinition(normalized.provider)
  const envKey = allowEnvKeyFallback ? env[definition.envKey]?.trim() : ''
  const resolvedApiKey = normalized.apiKey?.trim() || envKey || ''
  const resolvedModel = getResolvedModel(normalized.provider, normalized.model)

  return {
    definition,
    normalized,
    resolvedApiKey,
    resolvedModel,
  }
}

async function createJsonCompletion(input: {
  providerConfig: ProviderConfig
  apiKey: string
  model: string
  systemPrompt: string
  userPrompt: string
  maxTokens: number
}) {
  const definition = getProviderDefinition(input.providerConfig.provider)
  const client = new OpenAI({
    apiKey: input.apiKey,
    baseURL: definition.baseURL,
    timeout: AI_REQUEST_TIMEOUT_MS,
  })

  const requestPromise = client.chat.completions.create({
    model: input.model,
    temperature: 0.7,
    max_tokens: input.maxTokens,
    messages: [
      { role: 'system', content: input.systemPrompt },
      { role: 'user', content: input.userPrompt },
    ],
    response_format: { type: 'json_object' },
  })

  const completion = await withHardTimeout(requestPromise, AI_HARD_TIMEOUT_MS)

  const content = completion.choices[0]?.message?.content || '{}'
  return JSON.parse(content) as Record<string, unknown>
}

async function withHardTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof globalThis.setTimeout> | undefined

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = globalThis.setTimeout(() => {
          reject(new AIRequestTimeoutError())
        }, timeoutMs)
      }),
    ])
  } finally {
    if (timer) {
      globalThis.clearTimeout(timer)
    }
  }
}

function buildUnavailableMockResult(input: {
  prompt: string
  answers: ClarificationAnswer[]
  provider: ProviderConfig['provider']
  model: string
  label: string
  reason: string
}): OptimizationResult {
  const result = runMockOptimizer(input.prompt, input.answers)
  return {
    ...result,
    _mock: true,
    _notice: `${input.label} is temporarily unavailable (${input.reason}). Showing a local mock result so you can keep working.`,
    _provider: input.provider,
    _model: input.model,
  }
}

function isRecoverableAIError(error: unknown) {
  if (error instanceof AIRequestTimeoutError) {
    return true
  }

  if (!(error instanceof Error)) {
    return false
  }

  return /timed out|timeout|network|fetch failed|ECONNRESET|ECONNREFUSED|ENOTFOUND|EAI_AGAIN/i.test(error.message)
}

export async function testProviderConnection(options: TestProviderOptions) {
  const providerConfig = normalizeProviderConfig(options.providerConfig)
  const resolved = getResolvedProviderConfig(providerConfig, {}, false)

  if (!resolved.resolvedApiKey) {
    throw new OptimizationCoreError(400, `No API key configured for ${resolved.definition.label}.`)
  }

  try {
    await createJsonCompletion({
      providerConfig: resolved.normalized,
      apiKey: resolved.resolvedApiKey,
      model: resolved.resolvedModel,
      systemPrompt: 'Reply with valid JSON only: {"ok": true}',
      userPrompt: 'ping',
      maxTokens: 32,
    })
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new OptimizationCoreError(502, `AI service error: ${error.message}`)
    }
    throw error
  }
}

export async function runOptimization(
  payload: unknown,
  options: RunOptimizationOptions = {},
): Promise<OptimizationResult> {
  if (!isOptimizeRequestPayload(payload)) {
    throw new OptimizationCoreError(
      400,
      'Invalid request body. Expected { prompt: string, answers: array, providerConfig?: { provider, apiKey?, model? } }.',
    )
  }

  const { prompt, answers } = payload
  const providerConfig = normalizeProviderConfig(payload.providerConfig)
  const resolved = getResolvedProviderConfig(
    providerConfig,
    options.env ?? {},
    options.allowEnvKeyFallback ?? true,
  )

  const fullText = `${prompt} ${answers.map((answer) => answer.answer).join(' ')}`
  const safetyResult = checkServerSafety(fullText)
  if (!safetyResult.safe) {
    throw new OptimizationCoreError(422, safetyResult.reason ?? 'Request rejected by safety policy.')
  }

  if (!resolved.resolvedApiKey) {
    const result = runMockOptimizer(prompt, answers)
    return {
      ...result,
      _mock: true,
      _notice: `Running in mock mode because no API key is configured for ${resolved.definition.label}. Add a key to enable real AI optimization.`,
      _provider: resolved.normalized.provider,
      _model: resolved.resolvedModel,
    }
  }

  const isFirstPass =
    !hasAnswers(answers) ||
    answers.length === 0 ||
    answers.every((answer) => !answer.answer.trim())

  try {
    if (isFirstPass) {
      const parsed = await createJsonCompletion({
        providerConfig: resolved.normalized,
        apiKey: resolved.resolvedApiKey,
        model: resolved.resolvedModel,
        systemPrompt: getClarificationSystemPrompt(),
        userPrompt: `My image idea: ${prompt}`,
        maxTokens: 500,
      })

      return {
        optimizedPrompt: '',
        negativePrompt: '',
        modelAdvice: '',
        clarificationQuestions: Array.isArray(parsed.clarificationQuestions)
          ? parsed.clarificationQuestions.filter((question): question is string => typeof question === 'string')
          : [],
        _provider: resolved.normalized.provider,
        _model: resolved.resolvedModel,
      }
    }

    const answersText = answers
      .map((answer) => `Q: ${answer.question}\nA: ${answer.answer}`)
      .join('\n\n')

    const parsed = await createJsonCompletion({
      providerConfig: resolved.normalized,
      apiKey: resolved.resolvedApiKey,
      model: resolved.resolvedModel,
      systemPrompt: getOptimizationSystemPrompt(),
      userPrompt: `My image idea: ${prompt}\n\nMy answers:\n${answersText}`,
      maxTokens: 1000,
    })

    return {
      optimizedPrompt: typeof parsed.optimizedPrompt === 'string' ? parsed.optimizedPrompt : '',
      negativePrompt: typeof parsed.negativePrompt === 'string' ? parsed.negativePrompt : '',
      modelAdvice: typeof parsed.modelAdvice === 'string' ? parsed.modelAdvice : '',
      clarificationQuestions: [],
      _provider: resolved.normalized.provider,
      _model: resolved.resolvedModel,
    }
  } catch (error) {
    if (options.recoverWithMockOnUnavailable && isRecoverableAIError(error)) {
      return buildUnavailableMockResult({
        prompt,
        answers,
        provider: resolved.normalized.provider,
        model: resolved.resolvedModel,
        label: resolved.definition.label,
        reason: error instanceof Error ? error.message : 'provider unavailable',
      })
    }

    if (error instanceof OpenAI.APIError) {
      throw new OptimizationCoreError(502, `AI service error: ${error.message}`)
    }

    if (error instanceof AIRequestTimeoutError) {
      throw new OptimizationCoreError(502, `AI service error: ${error.message}`)
    }

    throw error
  }
}
