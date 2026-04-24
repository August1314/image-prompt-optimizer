import path from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  DEFAULT_ELECTRON_BUILDER_BINARIES_MIRROR,
  DMG_HELPER_RELEASE_NAME,
  DmgHelperPreparationError,
  getDmgHelperDescriptor,
  prepareDmgHelper,
} from './prepare-dmg-helper-lib.mjs'

describe('prepare-dmg-helper descriptor', () => {
  it('builds the expected arm64 mirror and official urls', () => {
    const descriptor = getDmgHelperDescriptor({
      arch: 'arm64',
      env: {},
      homeDir: '/Users/tester',
      platform: 'darwin',
      tmpDir: '/tmp',
    })

    expect(descriptor.filename).toBe('dmgbuild-bundle-arm64-75c8a6c.tar.gz')
    expect(descriptor.mirrorUrl).toBe(`${DEFAULT_ELECTRON_BUILDER_BINARIES_MIRROR}${DMG_HELPER_RELEASE_NAME}/${descriptor.filename}`)
    expect(descriptor.officialUrl).toBe(`https://github.com/electron-userland/electron-builder-binaries/releases/download/${DMG_HELPER_RELEASE_NAME}/${descriptor.filename}`)
    expect(descriptor.completeMarker).toContain(path.join('Library', 'Caches', 'electron-builder'))
  })

  it('respects a custom mirror url from environment variables', () => {
    const descriptor = getDmgHelperDescriptor({
      arch: 'x64',
      env: { ELECTRON_BUILDER_BINARIES_MIRROR: 'https://mirror.example.com/custom' },
      homeDir: '/Users/tester',
      platform: 'darwin',
      tmpDir: '/tmp',
    })

    expect(descriptor.mirrorUrl).toBe(`https://mirror.example.com/custom/${DMG_HELPER_RELEASE_NAME}/${descriptor.filename}`)
  })
})

describe('prepareDmgHelper', () => {
  const logger = {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns cached when the complete marker already exists', async () => {
    const fileSystem = {
      access: vi.fn().mockResolvedValue(undefined),
      mkdir: vi.fn(),
      readFile: vi.fn(),
      rm: vi.fn(),
      writeFile: vi.fn(),
    }

    const fetchImpl = vi.fn()

    const result = await prepareDmgHelper({
      arch: 'arm64',
      downloadImpl: vi.fn(),
      env: {},
      extractImpl: vi.fn(),
      fetchImpl,
      fileSystem: fileSystem as never,
      homeDir: '/Users/tester',
      logger,
      platform: 'darwin',
      tmpDir: '/tmp',
    })

    expect(result.status).toBe('cached')
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('falls back to official download after a mirror failure', async () => {
    const fileSystem = {
      access: vi.fn().mockRejectedValue(new Error('missing')),
      mkdir: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn().mockResolvedValue(Buffer.from('ok')),
      rm: vi.fn().mockResolvedValue(undefined),
      writeFile: vi.fn().mockResolvedValue(undefined),
    }

    const checksumPayload = Buffer.from('ok')
    fileSystem.readFile.mockResolvedValue(checksumPayload)

    const extractImpl = vi.fn().mockResolvedValue(undefined)
    const downloadImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error('mirror timeout'))
      .mockImplementationOnce(async (_url, destinationPath, { writeFile }) => {
        await writeFile(destinationPath, checksumPayload)
      })
    const validateChecksumImpl = vi.fn().mockResolvedValue(undefined)

    const result = await prepareDmgHelper({
      arch: 'arm64',
      downloadImpl,
      env: {},
      extractImpl,
      fetchImpl: vi.fn(),
      fileSystem: fileSystem as never,
      homeDir: '/Users/tester',
      logger,
      platform: 'darwin',
      tmpDir: '/tmp',
      validateChecksumImpl,
    })

    expect(result.status).toBe('downloaded')
    expect(result.source).toBe('official')
    expect(downloadImpl).toHaveBeenCalledTimes(2)
    expect(extractImpl).toHaveBeenCalledTimes(1)
    expect(validateChecksumImpl).toHaveBeenCalledTimes(1)
  })

  it('raises a structured error when both mirror and official downloads fail', async () => {
    const fileSystem = {
      access: vi.fn().mockRejectedValue(new Error('missing')),
      mkdir: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn(),
      rm: vi.fn().mockResolvedValue(undefined),
      writeFile: vi.fn(),
    }

    await expect(
      prepareDmgHelper({
        arch: 'arm64',
        downloadImpl: vi.fn().mockRejectedValue(new Error('network down')),
        env: {},
        fetchImpl: vi.fn().mockRejectedValue(new Error('network down')),
        fileSystem: fileSystem as never,
        homeDir: '/Users/tester',
        logger,
        platform: 'darwin',
        tmpDir: '/tmp',
        extractImpl: vi.fn(),
      }),
    ).rejects.toMatchObject({
      code: 'OFFICIAL_DOWNLOAD_FAILED',
    })
  })

  it('rejects unsupported architectures early', async () => {
    await expect(
      prepareDmgHelper({
        arch: 'ia32',
        downloadImpl: vi.fn(),
        env: {},
        fetchImpl: vi.fn(),
        fileSystem: {
          access: vi.fn(),
          mkdir: vi.fn(),
          readFile: vi.fn(),
          rm: vi.fn(),
          writeFile: vi.fn(),
        } as never,
        homeDir: '/Users/tester',
        extractImpl: vi.fn(),
        logger,
        platform: 'darwin',
        tmpDir: '/tmp',
      }),
    ).rejects.toBeInstanceOf(DmgHelperPreparationError)
  })
})
