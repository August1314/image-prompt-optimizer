// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { registerDesktopIpcHandlers } from './ipc'

describe('desktop IPC registration', () => {
  it('registers the optimizer and settings handlers', () => {
    const handle = vi.fn()

    registerDesktopIpcHandlers({
      ipcMain: { handle } as never,
      mainWindow: {} as never,
      settingsStore: {
        getSettings: vi.fn(),
        saveSettings: vi.fn(),
        updateProviderCheck: vi.fn(),
        clearProviderCheck: vi.fn(),
        toSecretStatuses: vi.fn(),
      },
      keychainService: {
        set: vi.fn(),
        clear: vi.fn(),
        get: vi.fn(),
        has: vi.fn(),
      },
      desktopOptimizer: {
        run: vi.fn(),
      },
      testProviderConnection: vi.fn(),
      licenseService: {
        importWithDialog: vi.fn(),
        status: vi.fn(),
        clear: vi.fn(),
      },
    })

    expect(handle).toHaveBeenCalledWith('desktopSettings:get', expect.any(Function))
    expect(handle).toHaveBeenCalledWith('desktopSettings:save', expect.any(Function))
    expect(handle).toHaveBeenCalledWith('optimizer:run', expect.any(Function))
    expect(handle).toHaveBeenCalledWith('license:status', expect.any(Function))
  })
})
