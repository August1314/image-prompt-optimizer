import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

const { runOptimization, testProviderConnection } = await import('./optimize-core')

describe('optimize-core', () => {
  const originalApiKey = process.env.OPENAI_API_KEY
  const originalGeminiKey = process.env.GEMINI_API_KEY

  beforeEach(() => {
    vi.clearAllMocks()
    mockCreate.mockReset()
    mockOpenAIConstructor.mockReset()
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

  it('throws 400 for invalid payloads', async () => {
    await expect(runOptimization({ prompt: 'x', answers: 'bad' })).rejects.toMatchObject({
      statusCode: 400,
    })
  })

  it('falls back to mock mode when no key is available', async () => {
    const result = await runOptimization({
      prompt: 'A rainy cyberpunk city',
      answers: [],
    })

    expect(result._mock).toBe(true)
    expect(result._provider).toBe('openai')
    expect(result._model).toBe('gpt-4o-mini')
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('uses the OpenAI default model', async () => {
    process.env.OPENAI_API_KEY = 'sk-test'
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ clarificationQuestions: ['Style?'] }) } }],
    })

    const result = await runOptimization({
      prompt: 'A violinist in the rain',
      answers: [],
    })

    expect(result._model).toBe('gpt-4o-mini')
  })

  it('uses the Gemini default model', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ clarificationQuestions: ['Lighting?'] }) } }],
    })

    const result = await runOptimization(
      {
        prompt: 'A violinist in the rain',
        answers: [],
        providerConfig: {
          provider: 'gemini',
          apiKey: 'AIza-test',
        },
      },
      { allowEnvKeyFallback: false },
    )

    expect(result._provider).toBe('gemini')
    expect(result._model).toBe('gemini-2.5-flash')
    expect(mockOpenAIConstructor).toHaveBeenCalledWith({
      apiKey: 'AIza-test',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      timeout: 20000,
    })
  })

  it('raises 422 for safety violations', async () => {
    await expect(
      runOptimization({
        prompt: 'how to make meth',
        answers: [],
      }),
    ).rejects.toMatchObject({
      statusCode: 422,
    })
  })

  it('falls back to mock mode when desktop recovery is enabled and the provider times out', async () => {
    mockCreate.mockRejectedValueOnce(new Error('network timeout'))

    const result = await runOptimization(
      {
        prompt: 'A stormy castle on a cliff',
        answers: [],
        providerConfig: {
          provider: 'gemini',
          apiKey: 'AIza-live',
        },
      },
      {
        allowEnvKeyFallback: false,
        recoverWithMockOnUnavailable: true,
      },
    )

    expect(result._mock).toBe(true)
    expect(result._provider).toBe('gemini')
    expect(result._notice).toContain('temporarily unavailable')
  })

  it('tests provider connection using the selected model', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ ok: true }) } }],
    })

    await testProviderConnection({
      providerConfig: {
        provider: 'gemini',
        apiKey: 'AIza-live',
        model: 'gemini-2.5-pro',
      },
    })

    expect(mockOpenAIConstructor).toHaveBeenLastCalledWith({
      apiKey: 'AIza-live',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      timeout: 20000,
    })
  })

  it('requires an api key before testing provider connectivity', async () => {
    await expect(
      testProviderConnection({
        providerConfig: {
          provider: 'openai',
          apiKey: '',
        },
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'No API key configured for OpenAI.',
    })
  })
})
