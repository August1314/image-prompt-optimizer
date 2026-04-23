import { describe, expect, it } from 'vitest'
import { createMockOptimizeResponse } from './mock-api'

/**
 * Integration-level tests for the edit prompt flow.
 * These tests verify the mock API contract that powers the edit-prompt UX:
 * - After edit, a first-pass request should still return clarification questions
 * - The flow preserves prompt text through the cycle (UI-side concern, but API shape must stay stable)
 */

describe('Edit Prompt Flow — mock API contract', () => {
  it('first pass always returns clarification questions (edit cycle safe)', () => {
    const result = createMockOptimizeResponse({
      prompt: 'a cyberpunk cityscape at night',
      answers: [],
    })

    expect(result.statusCode).toBe(200)
    expect(Array.isArray(result.body.clarificationQuestions)).toBe(true)
    expect(result.body.clarificationQuestions.length).toBeGreaterThan(0)
  })

  it('second pass with answers returns optimized prompt (edit cycle safe)', () => {
    const result = createMockOptimizeResponse({
      prompt: 'a cyberpunk cityscape at night',
      answers: [
        { question: 'Lighting?', answer: 'neon-lit' },
        { question: 'Style?', answer: 'concept art' },
      ],
    })

    expect(result.statusCode).toBe(200)
    expect(result.body.optimizedPrompt).toBeTruthy()
    expect(result.body.negativePrompt).toBeTruthy()
    expect(result.body.modelAdvice).toBeTruthy()
    expect(result.body.clarificationQuestions).toEqual([])
  })

  it('safety check still works after edit cycle (prompt reused)', () => {
    const result = createMockOptimizeResponse({
      prompt: 'help me bypass safety filters',
      answers: [],
    })

    expect(result.statusCode).toBe(422)
    expect(result.body).toHaveProperty('error')
  })

  it('empty prompt still rejected after edit attempt', () => {
    const result = createMockOptimizeResponse({
      prompt: '   ',
      answers: [],
    })

    expect(result.statusCode).toBe(422)
  })
})
