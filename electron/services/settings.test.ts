// @vitest-environment node
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { afterEach, describe, expect, it } from 'vitest'
import { createSettingsStore } from './settings'

const tempDirs: string[] = []

async function makeTempDir() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ipo-settings-'))
  tempDirs.push(dir)
  return dir
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })))
})

describe('settings store', () => {
  it('reads and writes desktop settings', async () => {
    const dir = await makeTempDir()
    const store = createSettingsStore(dir)

    await store.saveSettings({ provider: 'gemini', model: 'gemini-2.5-flash' })

    await expect(store.getSettings()).resolves.toEqual({
      provider: 'gemini',
      model: 'gemini-2.5-flash',
    })
  })

  it('records provider health checks in the settings file', async () => {
    const dir = await makeTempDir()
    const store = createSettingsStore(dir)
    await store.updateProviderCheck('openai', {
      lastCheckedAt: '2026-04-24T12:00:00.000Z',
      lastCheckOk: true,
    })

    const statuses = await store.toSecretStatuses({ openai: true, gemini: false })
    expect(statuses).toEqual([
      {
        provider: 'openai',
        hasKey: true,
        lastCheckedAt: '2026-04-24T12:00:00.000Z',
        lastCheckOk: true,
      },
      {
        provider: 'gemini',
        hasKey: false,
      },
    ])
  })
})
