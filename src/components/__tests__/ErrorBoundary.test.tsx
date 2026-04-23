import { describe, it, expect } from 'vitest'

/**
 * ErrorBoundary structural validation.
 * Since @testing-library/react is not installed, we verify the component
 * module exports and type contract rather than rendering.
 */

describe('ErrorBoundary — module and type contract', () => {
  it('exports a default class component', async () => {
    const mod = await import('../ErrorBoundary')
    expect(mod.default).toBeDefined()
    expect(typeof mod.default).toBe('function')
  })

  it('has getDerivedStateFromError static method', async () => {
    const mod = await import('../ErrorBoundary')
    const Component = mod.default
    expect(typeof (Component as any).getDerivedStateFromError).toBe('function')
  })
})
