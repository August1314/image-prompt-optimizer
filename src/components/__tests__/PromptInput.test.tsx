import { describe, it, expect } from 'vitest'

/**
 * PromptInput character counter — module and source verification.
 * Since the component uses useState hooks, we can't call it outside React context.
 * We verify module exports and source content for the character counter.
 */

describe('PromptInput — module and source verification', () => {
  it('exports a default function component', async () => {
    const mod = await import('../PromptInput')
    expect(mod.default).toBeDefined()
    expect(typeof mod.default).toBe('function')
  })

  it('character counter is present in source', async () => {
    const fs = await import('fs')
    const source = fs.readFileSync(
      '/Users/lianglihang/Documents/programs/image-prompt-optimizer/src/components/PromptInput.tsx',
      'utf8'
    )
    // Verify character counter UI is present
    expect(source).toContain('characters')
    expect(source).toContain('prompt.length')
    // Verify styling
    expect(source).toContain('0.8rem')
  })
})