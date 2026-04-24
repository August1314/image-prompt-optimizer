// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createDesktopApiBridge } from './preload.api'

describe('desktop preload bridge', () => {
  it('only forwards whitelisted invoke channels', async () => {
    const invoke = vi.fn().mockResolvedValue({ licensed: false })
    const api = createDesktopApiBridge(invoke)

    await api.license.status()
    await api.providerSecrets.status()

    expect(invoke).toHaveBeenNthCalledWith(1, 'license:status')
    expect(invoke).toHaveBeenNthCalledWith(2, 'providerSecrets:status')
  })
})
