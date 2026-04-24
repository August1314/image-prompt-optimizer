import type { DesktopOptimizationRequest } from '../../src/lib/desktop-types'
import { runOptimization } from '../../src/lib/optimize-core'
import type { DesktopAppSettings } from '../../src/lib/desktop-types'
import type { AIProvider } from '../../src/lib/types'

export function createDesktopOptimizer(deps: {
  getSettings: () => Promise<DesktopAppSettings>
  getSecret: (provider: AIProvider) => Promise<string | null>
}) {
  return {
    async run(request: DesktopOptimizationRequest) {
      const settings = await deps.getSettings()
      const apiKey = await deps.getSecret(settings.provider)

      return runOptimization(
        {
          prompt: request.prompt,
          answers: request.answers,
          providerConfig: {
            provider: settings.provider,
            model: settings.model,
            apiKey: apiKey ?? '',
          },
        },
        {
          allowEnvKeyFallback: false,
          recoverWithMockOnUnavailable: true,
        },
      )
    },
  }
}
