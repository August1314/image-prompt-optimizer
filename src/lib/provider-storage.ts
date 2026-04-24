import { getDefaultProviderConfig, isAIProvider, normalizeProviderConfig } from './providers'
import type { ProviderConfig } from './types'

const STORAGE_KEY = 'image-prompt-optimizer.provider-config'

export function loadProviderConfig(): ProviderConfig {
  if (typeof window === 'undefined') {
    return getDefaultProviderConfig()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return getDefaultProviderConfig()
    }

    const parsed = JSON.parse(raw) as Partial<ProviderConfig>
    if (!isAIProvider(parsed.provider)) {
      return getDefaultProviderConfig()
    }

    return normalizeProviderConfig(parsed)
  } catch {
    return getDefaultProviderConfig()
  }
}

export function saveProviderConfig(config: ProviderConfig) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProviderConfig(config)))
}
