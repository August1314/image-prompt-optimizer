import type { DesktopApi } from '../src/lib/desktop-types'

type Invoke = (channel: string, ...args: unknown[]) => Promise<unknown>

export function createDesktopApiBridge(invoke: Invoke): DesktopApi {
  return {
    desktopSettings: {
      get: () => invoke('desktopSettings:get') as ReturnType<DesktopApi['desktopSettings']['get']>,
      save: (settings) => invoke('desktopSettings:save', settings) as ReturnType<DesktopApi['desktopSettings']['save']>,
    },
    providerSecrets: {
      set: (input) => invoke('providerSecrets:set', input) as ReturnType<DesktopApi['providerSecrets']['set']>,
      clear: (provider) => invoke('providerSecrets:clear', provider) as ReturnType<DesktopApi['providerSecrets']['clear']>,
      status: () => invoke('providerSecrets:status') as ReturnType<DesktopApi['providerSecrets']['status']>,
      test: (provider) => invoke('providerSecrets:test', provider) as ReturnType<DesktopApi['providerSecrets']['test']>,
    },
    optimizer: {
      run: (request) => invoke('optimizer:run', request) as ReturnType<DesktopApi['optimizer']['run']>,
    },
    license: {
      import: () => invoke('license:import') as ReturnType<DesktopApi['license']['import']>,
      status: () => invoke('license:status') as ReturnType<DesktopApi['license']['status']>,
      clear: () => invoke('license:clear') as ReturnType<DesktopApi['license']['clear']>,
    },
  }
}
