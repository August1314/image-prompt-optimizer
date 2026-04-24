import { describe, it, expect, vi, beforeEach } from 'vitest'
import { optimizePrompt } from './prompt-optimizer'
import type { ProviderConfig } from './types'

const defaultProviderConfig: ProviderConfig = {
  provider: 'openai',
  apiKey: 'sk-local-test',
  model: 'gpt-4o-mini',
}

describe('optimizePrompt', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should send POST request to /api/optimize with prompt and empty answers', async () => {
    const mockResponse = {
      optimizedPrompt: '',
      negativePrompt: '',
      modelAdvice: '',
      clarificationQuestions: ['Q1', 'Q2'],
    }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }))

    const result = await optimizePrompt('a sunset', [], defaultProviderConfig)

    expect(fetch).toHaveBeenCalledWith('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'a sunset', answers: [], providerConfig: defaultProviderConfig }),
    })
    expect(result).toEqual(mockResponse)
  })

  it('should send POST request with clarification answers', async () => {
    const mockResponse = {
      optimizedPrompt: 'optimized prompt',
      negativePrompt: 'blurry, low quality',
      modelAdvice: 'Use Midjourney v6',
      clarificationQuestions: [],
    }

    const answers = [
      { question: 'Style?', answer: 'oil painting' },
      { question: 'Mood?', answer: 'dramatic' },
    ]

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }))

    const result = await optimizePrompt('a sunset', answers, defaultProviderConfig)

    expect(fetch).toHaveBeenCalledWith('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'a sunset', answers, providerConfig: defaultProviderConfig }),
    })
    expect(result.optimizedPrompt).toBe('optimized prompt')
    expect(result.negativePrompt).toBe('blurry, low quality')
    expect(result.modelAdvice).toBe('Use Midjourney v6')
  })

  it('should throw on non-ok response with JSON error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ error: 'Content policy violation' }),
    }))

    await expect(optimizePrompt('bad input', [], defaultProviderConfig)).rejects.toThrow('Content policy violation')
  })

  it('should throw on non-ok response without JSON body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('not json')),
    }))

    // When JSON parsing fails, the catch fallback returns { error: 'Request failed.' }
    await expect(optimizePrompt('test', [], defaultProviderConfig)).rejects.toThrow('Request failed.')
  })

  it('should throw on non-ok response with JSON but no error field', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: () => Promise.resolve({ detail: 'upstream timeout' }),
    }))

    await expect(optimizePrompt('test', [], defaultProviderConfig)).rejects.toThrow('Server error: 502')
  })
})
