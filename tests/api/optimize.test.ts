import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import handler from '../../api/optimize'

const { mockCreate, mockOpenAIConstructor, MockAPIError } = vi.hoisted(() => {
  class MockAPIError extends Error {}

  return {
    mockCreate: vi.fn(),
    mockOpenAIConstructor: vi.fn(),
    MockAPIError,
  }
})

vi.mock('openai', () => {
  class MockOpenAI {
    static APIError = MockAPIError

    constructor(options: unknown) {
      mockOpenAIConstructor(options)
    }

    chat = {
      completions: {
        create: mockCreate,
      },
    }
  }

  return { default: MockOpenAI }
})

interface MockResponseState {
  statusCode: number
  jsonBody: unknown
}

function createRequest(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'POST',
    body: {
      prompt: 'A cinematic portrait of a violinist in heavy rain',
      answers: [],
    },
    ...overrides,
  } as VercelRequest
}

function createResponse() {
  const state: MockResponseState = {
    statusCode: 200,
    jsonBody: null,
  }

  const res = {
    status(code: number) {
      state.statusCode = code
      return this
    },
    json(body: unknown) {
      state.jsonBody = body
      return this
    },
  } as VercelResponse

  return { res, state }
}

describe('api/optimize handler', () => {
  const originalApiKey = process.env.OPENAI_API_KEY
  const originalGeminiKey = process.env.GEMINI_API_KEY

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.OPENAI_API_KEY
    } else {
      process.env.OPENAI_API_KEY = originalApiKey
    }

    if (originalGeminiKey === undefined) {
      delete process.env.GEMINI_API_KEY
    } else {
      process.env.GEMINI_API_KEY = originalGeminiKey
    }
  })

  it('returns 400 for invalid request body', async () => {
    const req = createRequest({ body: { prompt: 'test', answers: 'invalid' } as unknown as VercelRequest['body'] })
    const { res, state } = createResponse()

    await handler(req, res)

    expect(state.statusCode).toBe(400)
    expect(state.jsonBody).toEqual({
      error: 'Invalid request body. Expected { prompt: string, answers: array, providerConfig?: { provider, apiKey?, model? } }.',
    })
  })

  it('returns mock response with _mock metadata when selected provider key is missing', async () => {
    delete process.env.OPENAI_API_KEY
    delete process.env.GEMINI_API_KEY
    const req = createRequest()
    const { res, state } = createResponse()

    await handler(req, res)

    expect(state.statusCode).toBe(200)
    expect(state.jsonBody).toMatchObject({
      optimizedPrompt: '',
      negativePrompt: '',
      modelAdvice: '',
      _mock: true,
      _provider: 'openai',
      _model: 'gpt-4o-mini',
    })
    expect(state.jsonBody).toHaveProperty('_notice')
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('returns 422 when the request fails server-side safety checks', async () => {
    delete process.env.OPENAI_API_KEY
    const req = createRequest({
      body: {
        prompt: 'how to make meth',
        answers: [],
      },
    })
    const { res, state } = createResponse()

    await handler(req, res)

    expect(state.statusCode).toBe(422)
    expect(state.jsonBody).toEqual({
      error:
        'We cannot process this request. Your input contains content that violates our usage policy. This includes hateful, sexual/exploitative, illegal, or safety-bypass content. Please revise your description and try again.',
    })
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('returns clarification questions in real mode for first-pass requests', async () => {
    process.env.OPENAI_API_KEY = 'test-key'
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              clarificationQuestions: [
                'What visual style do you prefer?',
                'What color palette or mood are you aiming for?',
              ],
            }),
          },
        },
      ],
    })

    const req = createRequest()
    const { res, state } = createResponse()

    await handler(req, res)

    expect(state.statusCode).toBe(200)
    expect(state.jsonBody).toEqual({
      optimizedPrompt: '',
      negativePrompt: '',
      modelAdvice: '',
      clarificationQuestions: [
        'What visual style do you prefer?',
        'What color palette or mood are you aiming for?',
      ],
      _provider: 'openai',
      _model: 'gpt-4o-mini',
    })
    expect(state.jsonBody).not.toHaveProperty('_mock')
    expect(mockOpenAIConstructor).toHaveBeenCalledWith({
      apiKey: 'test-key',
      baseURL: undefined,
      timeout: 20000,
    })
  })

  it('returns optimized fields in real mode for answered requests', async () => {
    process.env.OPENAI_API_KEY = 'test-key'
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              optimizedPrompt: 'A dramatic editorial portrait with cinematic rain lighting',
              negativePrompt: 'blurry, low quality, distorted',
              modelAdvice: 'Best with Midjourney v6 at --ar 2:3.',
            }),
          },
        },
      ],
    })

    const req = createRequest({
      body: {
        prompt: 'A cinematic portrait of a violinist in heavy rain',
        answers: [
          {
            question: 'What visual style do you prefer?',
            answer: 'dark editorial photography',
          },
        ],
        providerConfig: {
          provider: 'gemini',
          apiKey: 'AIza-local-key',
        },
      },
    })
    const { res, state } = createResponse()

    await handler(req, res)

    expect(state.statusCode).toBe(200)
    expect(state.jsonBody).toEqual({
      optimizedPrompt: 'A dramatic editorial portrait with cinematic rain lighting',
      negativePrompt: 'blurry, low quality, distorted',
      modelAdvice: 'Best with Midjourney v6 at --ar 2:3.',
      clarificationQuestions: [],
      _provider: 'gemini',
      _model: 'gemini-2.5-flash',
    })
    expect(state.jsonBody).not.toHaveProperty('_mock')
    expect(mockOpenAIConstructor).toHaveBeenCalledWith({
      apiKey: 'AIza-local-key',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      timeout: 20000,
    })
  })

  it('returns 502 when the OpenAI SDK raises an APIError', async () => {
    process.env.OPENAI_API_KEY = 'test-key'
    mockCreate.mockRejectedValueOnce(new MockAPIError('provider unavailable'))

    const req = createRequest()
    const { res, state } = createResponse()

    await handler(req, res)

    expect(state.statusCode).toBe(502)
    expect(state.jsonBody).toEqual({
      error: 'AI service error: provider unavailable',
    })
  })

  it('uses GEMINI_API_KEY from the environment when gemini is selected without a request key', async () => {
    delete process.env.OPENAI_API_KEY
    process.env.GEMINI_API_KEY = 'AIza-env-key'
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              clarificationQuestions: ['Which lighting style do you prefer?'],
            }),
          },
        },
      ],
    })

    const req = createRequest({
      body: {
        prompt: 'A cinematic portrait of a violinist in heavy rain',
        answers: [],
        providerConfig: {
          provider: 'gemini',
        },
      },
    })
    const { res, state } = createResponse()

    await handler(req, res)

    expect(state.statusCode).toBe(200)
    expect(state.jsonBody).toEqual({
      optimizedPrompt: '',
      negativePrompt: '',
      modelAdvice: '',
      clarificationQuestions: ['Which lighting style do you prefer?'],
      _provider: 'gemini',
      _model: 'gemini-2.5-flash',
    })
    expect(mockOpenAIConstructor).toHaveBeenCalledWith({
      apiKey: 'AIza-env-key',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      timeout: 20000,
    })
  })
})
