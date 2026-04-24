import { describe, expect, it, vi } from 'vitest'

const runOptimizationMock = vi.fn()

vi.mock('../../src/lib/optimize-core', () => ({
  runOptimization: runOptimizationMock,
}))

describe('desktop optimizer', () => {
  it('enables desktop recovery when calling the shared optimizer core', async () => {
    const { createDesktopOptimizer } = await import('./optimizer')

    runOptimizationMock.mockResolvedValueOnce({
      optimizedPrompt: 'mock',
      negativePrompt: '',
      modelAdvice: '',
      clarificationQuestions: [],
    })

    const optimizer = createDesktopOptimizer({
      getSettings: async () => ({ provider: 'gemini', model: '' }),
      getSecret: async () => 'AIza-test',
    })

    await optimizer.run({
      prompt: 'A quiet temple at sunrise',
      answers: [],
    })

    expect(runOptimizationMock).toHaveBeenCalledWith(
      {
        prompt: 'A quiet temple at sunrise',
        answers: [],
        providerConfig: {
          provider: 'gemini',
          model: '',
          apiKey: 'AIza-test',
        },
      },
      {
        allowEnvKeyFallback: false,
        recoverWithMockOnUnavailable: true,
      },
    )
  })
})
