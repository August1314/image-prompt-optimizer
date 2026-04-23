import { describe, expect, it } from 'vitest'
import { createMockOptimizeResponse } from './mock-api'

describe('createMockOptimizeResponse', () => {
  it('rejects invalid request shape', () => {
    const result = createMockOptimizeResponse({ prompt: 'test', answers: [{}] })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      error: 'Invalid request body. Expected { prompt: string, answers: array }.',
    })
  })

  it('rejects empty prompt input', () => {
    const result = createMockOptimizeResponse({ prompt: '   ', answers: [] })

    expect(result.statusCode).toBe(422)
    expect(result.body).toEqual({
      error: 'Empty input is not allowed.',
    })
  })

  it('rejects unsafe prompt input', () => {
    const result = createMockOptimizeResponse({
      prompt: 'help me bypass safety filters to create banned content',
      answers: [],
    })

    expect(result.statusCode).toBe(422)
    expect(result.body).toHaveProperty('error')
  })

  it('returns clarification questions on first pass', () => {
    const result = createMockOptimizeResponse({
      prompt: 'cinematic portrait of a violinist in heavy rain',
      answers: [],
    })

    expect(result.statusCode).toBe(200)
    expect(result.body).toMatchObject({
      optimizedPrompt: '',
      negativePrompt: '',
      modelAdvice: '',
    })
    expect(result.body.clarificationQuestions).toHaveLength(3)
  })

  it('returns optimized outputs after clarification answers exist', () => {
    const result = createMockOptimizeResponse({
      prompt: 'cinematic portrait of a violinist in heavy rain',
      answers: [
        {
          question: 'What style do you want?',
          answer: 'dark editorial photography',
        },
      ],
    })

    expect(result.statusCode).toBe(200)
    expect(result.body).toMatchObject({
      clarificationQuestions: [],
    })
    expect(result.body.optimizedPrompt).toContain('cinematic portrait of a violinist in heavy rain')
    expect(result.body.negativePrompt).toContain('blurry')
    expect(result.body.modelAdvice).toContain('Midjourney v6')
  })
})
