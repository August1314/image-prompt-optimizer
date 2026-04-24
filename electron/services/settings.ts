import fs from 'fs/promises'
import path from 'path'
import { DEFAULT_PROVIDER, isAIProvider } from '../../src/lib/providers'
import type { AIProvider } from '../../src/lib/types'
import type { DesktopAppSettings, ProviderSecretStatus } from '../../src/lib/desktop-types'

interface ProviderCheckState {
  lastCheckedAt?: string
  lastCheckOk?: boolean
  lastError?: string
}

interface StoredDesktopState {
  provider: AIProvider
  model: string
  providerChecks?: Partial<Record<AIProvider, ProviderCheckState>>
}

const SETTINGS_FILE_NAME = 'settings.json'

function normalizeStoredState(input?: Partial<StoredDesktopState>): StoredDesktopState {
  const provider = isAIProvider(input?.provider) ? input.provider : DEFAULT_PROVIDER
  return {
    provider,
    model: typeof input?.model === 'string' ? input.model : '',
    providerChecks: input?.providerChecks ?? {},
  }
}

export function createSettingsStore(baseDir: string) {
  const settingsPath = path.join(baseDir, SETTINGS_FILE_NAME)

  async function ensureDir() {
    await fs.mkdir(baseDir, { recursive: true })
  }

  async function readState(): Promise<StoredDesktopState> {
    await ensureDir()
    try {
      const raw = await fs.readFile(settingsPath, 'utf8')
      return normalizeStoredState(JSON.parse(raw) as Partial<StoredDesktopState>)
    } catch {
      return normalizeStoredState()
    }
  }

  async function writeState(state: StoredDesktopState) {
    await ensureDir()
    await fs.writeFile(settingsPath, JSON.stringify(state, null, 2), 'utf8')
  }

  return {
    async getSettings(): Promise<DesktopAppSettings> {
      const state = await readState()
      return {
        provider: state.provider,
        model: state.model,
      }
    },
    async saveSettings(settings: DesktopAppSettings): Promise<DesktopAppSettings> {
      const state = await readState()
      const nextState = normalizeStoredState({
        ...state,
        provider: settings.provider,
        model: settings.model,
      })
      await writeState(nextState)
      return {
        provider: nextState.provider,
        model: nextState.model,
      }
    },
    async getProviderChecks() {
      const state = await readState()
      return state.providerChecks ?? {}
    },
    async updateProviderCheck(provider: AIProvider, check: ProviderCheckState) {
      const state = await readState()
      const nextState = normalizeStoredState({
        ...state,
        providerChecks: {
          ...state.providerChecks,
          [provider]: check,
        },
      })
      await writeState(nextState)
    },
    async clearProviderCheck(provider: AIProvider) {
      const state = await readState()
      const nextChecks = { ...(state.providerChecks ?? {}) }
      delete nextChecks[provider]
      const nextState = normalizeStoredState({
        ...state,
        providerChecks: nextChecks,
      })
      await writeState(nextState)
    },
    async toSecretStatuses(hasKeyMap: Record<AIProvider, boolean>): Promise<ProviderSecretStatus[]> {
      const checks = await this.getProviderChecks()
      return (['openai', 'gemini'] as const).map((provider) => ({
        provider,
        hasKey: hasKeyMap[provider],
        ...checks[provider],
      }))
    },
  }
}
