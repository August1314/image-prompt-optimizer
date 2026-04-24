import type { BrowserWindow, IpcMain } from 'electron'
import { DEFAULT_PROVIDER, getResolvedModel } from '../src/lib/providers'
import type { AIProvider } from '../src/lib/types'
import type { LicenseStatus } from '../src/lib/desktop-types'

interface RegisterDesktopIpcHandlersOptions {
  ipcMain: Pick<IpcMain, 'handle'>
  mainWindow: BrowserWindow
  settingsStore: {
    getSettings: () => Promise<{ provider: AIProvider; model: string }>
    saveSettings: (settings: { provider: AIProvider; model: string }) => Promise<{ provider: AIProvider; model: string }>
    updateProviderCheck: (provider: AIProvider, check: { lastCheckedAt: string; lastCheckOk: boolean; lastError?: string }) => Promise<void>
    clearProviderCheck: (provider: AIProvider) => Promise<void>
    toSecretStatuses: (hasKeyMap: Record<AIProvider, boolean>) => Promise<Array<{
      provider: AIProvider
      hasKey: boolean
      lastCheckedAt?: string
      lastCheckOk?: boolean
      lastError?: string
    }>>
  }
  keychainService: {
    set: (provider: AIProvider, apiKey: string) => Promise<void>
    clear: (provider: AIProvider) => Promise<void>
    get: (provider: AIProvider) => Promise<string | null>
    has: (provider: AIProvider) => Promise<boolean>
  }
  desktopOptimizer: {
    run: (request: { prompt: string; answers: Array<{ question: string; answer: string }> }) => Promise<unknown>
  }
  testProviderConnection: (input: { provider: AIProvider; apiKey: string; model?: string }) => Promise<void>
  licenseService: {
    importWithDialog: (window: BrowserWindow) => Promise<LicenseStatus>
    status: () => Promise<LicenseStatus>
    clear: () => Promise<LicenseStatus>
  }
}

async function buildSecretStatuses(options: RegisterDesktopIpcHandlersOptions) {
  async function safeHas(provider: AIProvider) {
    try {
      return await options.keychainService.has(provider)
    } catch {
      return false
    }
  }

  const hasKeyMap = {
    openai: await safeHas('openai'),
    gemini: await safeHas('gemini'),
  } satisfies Record<AIProvider, boolean>

  return options.settingsStore.toSecretStatuses(hasKeyMap)
}

export function registerDesktopIpcHandlers(options: RegisterDesktopIpcHandlersOptions) {
  const providerChannels = {
    set: 'providerSecrets:set',
    clear: 'providerSecrets:clear',
    status: 'providerSecrets:status',
    test: 'providerSecrets:test',
  } as const

  options.ipcMain.handle('desktopSettings:get', () => options.settingsStore.getSettings())
  options.ipcMain.handle('desktopSettings:save', (_event, settings) => options.settingsStore.saveSettings(settings))
  options.ipcMain.handle(providerChannels.set, async (_event, input) => {
    await options.keychainService.set(input.provider, input.apiKey)
    await options.settingsStore.clearProviderCheck(input.provider)
    return buildSecretStatuses(options)
  })
  options.ipcMain.handle(providerChannels.clear, async (_event, provider) => {
    await options.keychainService.clear(provider)
    await options.settingsStore.clearProviderCheck(provider)
    return buildSecretStatuses(options)
  })
  options.ipcMain.handle(providerChannels.status, () => buildSecretStatuses(options))
  options.ipcMain.handle(providerChannels.test, async (_event, provider) => {
    const apiKey = await options.keychainService.get(provider)
    if (!apiKey) {
      await options.settingsStore.updateProviderCheck(provider, {
        lastCheckedAt: new Date().toISOString(),
        lastCheckOk: false,
        lastError: 'No API key configured for this provider.',
      })
      return buildSecretStatuses(options)
    }

    const settings = await options.settingsStore.getSettings()
    try {
      await options.testProviderConnection({
        provider,
        apiKey,
        model: settings.provider === provider ? settings.model : getResolvedModel(provider, ''),
      })
      await options.settingsStore.updateProviderCheck(provider, {
        lastCheckedAt: new Date().toISOString(),
        lastCheckOk: true,
      })
    } catch (error) {
      await options.settingsStore.updateProviderCheck(provider, {
        lastCheckedAt: new Date().toISOString(),
        lastCheckOk: false,
        lastError: error instanceof Error ? error.message : 'Provider test failed.',
      })
    }
    return buildSecretStatuses(options)
  })
  options.ipcMain.handle('optimizer:run', (_event, request) => options.desktopOptimizer.run(request))
  options.ipcMain.handle('license:import', () => options.licenseService.importWithDialog(options.mainWindow))
  options.ipcMain.handle('license:status', () => options.licenseService.status())
  options.ipcMain.handle('license:clear', () => options.licenseService.clear())
}

export function createProviderConnectionTester(
  runner: RegisterDesktopIpcHandlersOptions['testProviderConnection'],
) {
  return async (input: { provider: AIProvider; apiKey: string; model?: string }) =>
    runner({
      provider: input.provider ?? DEFAULT_PROVIDER,
      apiKey: input.apiKey,
      model: input.model,
    })
}
