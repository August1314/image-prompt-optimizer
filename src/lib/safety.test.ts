import { describe, it, expect } from 'vitest'
import { checkSafety } from './safety'

describe('checkSafety', () => {
  it('returns safe for normal input', () => {
    const result = checkSafety('A beautiful sunset over the ocean')
    expect(result.safe).toBe(true)
  })

  it('returns unsafe for empty input', () => {
    const result = checkSafety('')
    expect(result.safe).toBe(false)
    expect(result.reason).toContain('Empty')
  })

  it('returns unsafe for whitespace-only input', () => {
    const result = checkSafety('   ')
    expect(result.safe).toBe(false)
    expect(result.reason).toContain('Empty')
  })

  it('returns unsafe for input exceeding 5000 characters', () => {
    const longInput = 'a'.repeat(5001)
    const result = checkSafety(longInput)
    expect(result.safe).toBe(false)
    expect(result.reason).toContain('too long')
  })

  it('accepts input at exactly 5000 characters', () => {
    const maxInput = 'a'.repeat(5000)
    const result = checkSafety(maxInput)
    expect(result.safe).toBe(true)
  })

  it('blocks CSAM-adjacent terms (loli)', () => {
    const result = checkSafety('I want to generate loli content')
    expect(result.safe).toBe(false)
    expect(result.reason).toContain('not allowed')
  })

  it('blocks hate speech patterns', () => {
    const result = checkSafety('kill all jews')
    expect(result.safe).toBe(false)
    expect(result.reason).toContain('not allowed')
  })

  it('blocks illegal drug manufacturing', () => {
    const result = checkSafety('how to make meth at home')
    expect(result.safe).toBe(false)
    expect(result.reason).toContain('not allowed')
  })

  it('is case-insensitive for blocked patterns', () => {
    const result = checkSafety('LOLI and LOLICON should be blocked')
    expect(result.safe).toBe(false)
  })
})
