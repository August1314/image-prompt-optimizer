// @vitest-environment node
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { afterEach, describe, expect, it } from 'vitest'
import { createLicenseService, signDevLicense } from './license'

const tempDirs: string[] = []

async function makeTempDir() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ipo-license-'))
  tempDirs.push(dir)
  return dir
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })))
})

describe('license service', () => {
  it('imports and validates a signed license file', async () => {
    const dir = await makeTempDir()
    const licensePath = path.join(dir, 'candidate.lic')
    const service = createLicenseService(path.join(dir, 'app'))
    const license = signDevLicense({
      licenseId: 'lic-1',
      issuedTo: 'Tester',
      plan: 'desktop-buyout',
      issuedAt: '2026-04-24T00:00:00.000Z',
      perpetual: true,
    })

    await fs.writeFile(licensePath, JSON.stringify(license), 'utf8')
    const status = await service.importFromFile(licensePath)

    expect(status).toEqual({
      licensed: true,
      issuedTo: 'Tester',
      plan: 'desktop-buyout',
      expiresAt: undefined,
      perpetual: true,
    })
  })

  it('rejects invalid signatures', async () => {
    const dir = await makeTempDir()
    const licensePath = path.join(dir, 'candidate.lic')
    const service = createLicenseService(path.join(dir, 'app'))

    await fs.writeFile(
      licensePath,
      JSON.stringify({
        licenseId: 'lic-2',
        issuedTo: 'Tester',
        plan: 'desktop-buyout',
        issuedAt: '2026-04-24T00:00:00.000Z',
        perpetual: true,
        signature: 'bad-signature',
      }),
      'utf8',
    )

    const status = await service.importFromFile(licensePath)
    expect(status).toEqual({
      licensed: false,
      error: 'License signature verification failed.',
    })
  })

  it('clears imported licenses', async () => {
    const dir = await makeTempDir()
    const licensePath = path.join(dir, 'candidate.lic')
    const service = createLicenseService(path.join(dir, 'app'))
    const license = signDevLicense({
      licenseId: 'lic-3',
      issuedTo: 'Tester',
      plan: 'desktop-buyout',
      issuedAt: '2026-04-24T00:00:00.000Z',
      perpetual: true,
    })

    await fs.writeFile(licensePath, JSON.stringify(license), 'utf8')
    await service.importFromFile(licensePath)
    await expect(service.clear()).resolves.toEqual({ licensed: false })
  })
})
