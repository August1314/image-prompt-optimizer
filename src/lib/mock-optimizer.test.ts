import { describe, it, expect } from 'vitest'
import { runMockOptimizer } from './mock-optimizer' 

describe('runMockOptimizer', () => {
  it('returns clarification questions for empty answers (first pass)', () => {
    const result = runMockOptimizer('a beautiful landscape', [])
    expect(result.optimizedPrompt).toBe('')
    expect(result.negativePrompt).toBe('')
    expect(result.modelAdvice).toBe('')
    expect(result.clarificationQuestions).toBeDefined()
    expect(result.clarificationQuestions!.length).toBeGreaterThan(0)
  })

  it('returns clarification questions for answers with empty strings', () => {
    const result = runMockOptimizer('a portrait', [
      { question: 'Style?', answer: '' },
      { question: 'Mood?', answer: '  ' },
    ])
    expect(result.clarificationQuestions).toBeDefined()
    expect(result.clarificationQuestions!.length).toBeGreaterThan(0)
  })

  it('returns optimized prompt when answers are provided', () => {
    const result = runMockOptimizer('a cyberpunk city', [
      { question: 'Style?', answer: 'neon noir' },
      { question: 'Time?', answer: 'midnight' },
    ])
    expect(result.optimizedPrompt).toContain('cyberpunk city')
    expect(result.optimizedPrompt).toContain('neon noir')
    expect(result.optimizedPrompt).toContain('midnight')
    expect(result.negativePrompt).toBeTruthy()
    expect(result.modelAdvice).toContain('Midjourney')
    expect(result.clarificationQuestions).toEqual([])
  })

  it('includes landscape-specific question for landscape prompt', () => {
    const result = runMockOptimizer('a mountain landscape', [])
    const questions = result.clarificationQuestions!
    expect(questions.some((q) => /lighting/i.test(q))).toBe(true)
  })

  it('includes character-specific question for portrait prompt', () => {
    const result = runMockOptimizer('a portrait of a warrior', [])
    const questions = result.clarificationQuestions!
    expect(questions.some((q) => /style|art/i.test(q))).toBe(true)
  })

  it('limits questions to max 3', () => {
    const result = runMockOptimizer('a person in a city landscape', [])
    expect(result.clarificationQuestions!.length).toBeLessThanOrEqual(3)
  })
})
