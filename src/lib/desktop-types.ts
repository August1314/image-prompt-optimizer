import type { AIProvider, ClarificationAnswer, OptimizationResult } from './types'

export interface DesktopAppSettings {
  provider: AIProvider
  model: string
}

export interface ProviderSecretStatus {
  provider: AIProvider
  hasKey: boolean
  lastCheckedAt?: string
  lastCheckOk?: boolean
  lastError?: string
}

export interface LicenseStatus {
  licensed: boolean
  issuedTo?: string
  plan?: string
  expiresAt?: string
  perpetual?: boolean
  error?: string
}

export interface DesktopOptimizationRequest {
  prompt: string
  answers: ClarificationAnswer[]
}

export interface DesktopApi {
  desktopSettings: {
    get: () => Promise<DesktopAppSettings>
    save: (settings: DesktopAppSettings) => Promise<DesktopAppSettings>
  }
  providerSecrets: {
    set: (input: { provider: AIProvider; apiKey: string }) => Promise<ProviderSecretStatus[]>
    clear: (provider: AIProvider) => Promise<ProviderSecretStatus[]>
    status: () => Promise<ProviderSecretStatus[]>
    test: (provider: AIProvider) => Promise<ProviderSecretStatus[]>
  }
  optimizer: {
    run: (request: DesktopOptimizationRequest) => Promise<OptimizationResult>
  }
  license: {
    import: () => Promise<LicenseStatus>
    status: () => Promise<LicenseStatus>
    clear: () => Promise<LicenseStatus>
  }
}
