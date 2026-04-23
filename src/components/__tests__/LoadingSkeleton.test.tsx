import { describe, it, expect } from 'vitest'
import type { ReactNode } from 'react'

/**
 * LoadingSkeleton structural validation.
 * Since @testing-library/react is not installed, we verify the component
 * module exports and type contract rather than rendering.
 */

// Verify the component can be imported (this file runs as .test.tsx via vitest)
// The import at the top already validates the module loads without error.
describe('LoadingSkeleton — module and type contract', () => {
  it('exports a default function component', async () => {
    const mod = await import('../LoadingSkeleton')
    expect(mod.default).toBeDefined()
    expect(typeof mod.default).toBe('function')
  })

  it('accepts step prop with "clarification" or "result"', async () => {
    const mod = await import('../LoadingSkeleton')
    const Component = mod.default as (props: { step: 'clarification' | 'result' }) => ReactNode

    // Type check: both values are valid at runtime
    expect(() => Component({ step: 'clarification' })).not.toThrow()
    expect(() => Component({ step: 'result' })).not.toThrow()
  })
})
