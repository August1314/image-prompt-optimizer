import { createHash, randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const tar = require('tar')

export const DMG_HELPER_RELEASE_NAME = 'dmg-builder@1.2.0'
export const DMG_HELPER_RELEASE_VERSION = '75c8a6c'
export const DEFAULT_ELECTRON_BUILDER_BINARIES_MIRROR = 'https://mirrors.huaweicloud.com/electron-builder-binaries/'
export const OFFICIAL_ELECTRON_BUILDER_RELEASE_BASE_URL = 'https://github.com/electron-userland/electron-builder-binaries/releases/download/'

const DMG_HELPER_SHA256_BY_ARCH = {
  arm64: 'a785f2a385c8c31996a089ef8e26361904b40c772d5ea65a36001212f1fc25e0',
  x86_64: '87b3bb72148b11451ee90ede79cc8d59305c9173b68b0f2b50a3bea51fc4a4e2',
}

export class DmgHelperPreparationError extends Error {
  constructor(code, message, details = {}) {
    super(message)
    this.name = 'DmgHelperPreparationError'
    this.code = code
    this.details = details
  }
}

export function hashUrlSafe(input, length = 5) {
  let hash = 5381

  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(index)
  }

  hash >>>= 0

  const output = hash.toString(36)
  return output.length >= length ? output.slice(0, length) : output.padStart(length, '0')
}

export function normalizeBaseUrl(baseUrl) {
  if (!baseUrl) return ''
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}

export function getElectronBuilderCacheDirectory({
  env = process.env,
  platform = process.platform,
  homeDir = os.homedir(),
  tmpDir = os.tmpdir(),
} = {}) {
  const customCacheDir = env.ELECTRON_BUILDER_CACHE?.trim()

  if (customCacheDir) {
    return customCacheDir
  }

  if (platform === 'darwin') {
    return path.join(homeDir, 'Library', 'Caches', 'electron-builder')
  }

  if (platform === 'win32') {
    const localAppData = env.LOCALAPPDATA?.trim()
    return localAppData
      ? path.join(localAppData, 'electron-builder', 'Cache')
      : path.join(tmpDir, 'electron-builder-cache')
  }

  const xdgCache = env.XDG_CACHE_HOME?.trim()
  return xdgCache
    ? path.join(xdgCache, 'electron-builder')
    : path.join(homeDir, '.cache', 'electron-builder')
}

export function resolveDmgHelperArch(arch = process.arch) {
  if (arch === 'arm64') {
    return 'arm64'
  }

  if (arch === 'x64' || arch === 'x86_64') {
    return 'x86_64'
  }

  throw new DmgHelperPreparationError(
    'ARCH_MISMATCH',
    `Unsupported DMG helper architecture: ${arch}`,
    { arch },
  )
}

export function getDmgHelperDescriptor({
  arch = process.arch,
  env = process.env,
  platform = process.platform,
  homeDir = os.homedir(),
  tmpDir = os.tmpdir(),
} = {}) {
  const helperArch = resolveDmgHelperArch(arch)
  const filename = `dmgbuild-bundle-${helperArch}-${DMG_HELPER_RELEASE_VERSION}.tar.gz`
  const checksum = DMG_HELPER_SHA256_BY_ARCH[helperArch]
  const cacheDirectory = getElectronBuilderCacheDirectory({ env, platform, homeDir, tmpDir })
  const suffix = hashUrlSafe(`${OFFICIAL_ELECTRON_BUILDER_RELEASE_BASE_URL}-${DMG_HELPER_RELEASE_NAME}-${filename}`)
  const folderName = `${filename.replace(/\.(tar\.gz|tgz)$/, '')}-${suffix}`
  const extractDir = path.join(cacheDirectory, DMG_HELPER_RELEASE_NAME, folderName)
  const completeMarker = `${extractDir}.complete`
  const mirrorBaseUrl = normalizeBaseUrl(
    env.ELECTRON_BUILDER_BINARIES_MIRROR?.trim() || DEFAULT_ELECTRON_BUILDER_BINARIES_MIRROR,
  )
  const officialUrl = `${OFFICIAL_ELECTRON_BUILDER_RELEASE_BASE_URL}${DMG_HELPER_RELEASE_NAME}/${filename}`
  const mirrorUrl = `${mirrorBaseUrl}${DMG_HELPER_RELEASE_NAME}/${filename}`

  return {
    arch: helperArch,
    checksum,
    filename,
    cacheDirectory,
    extractDir,
    completeMarker,
    mirrorBaseUrl,
    mirrorUrl,
    officialUrl,
    releaseName: DMG_HELPER_RELEASE_NAME,
  }
}

function defaultLogger() {
  return {
    info: console.log,
    warn: console.warn,
    error: console.error,
  }
}

async function pathExists(targetPath, adapter) {
  try {
    await adapter.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function downloadToFile(url, destinationPath, { fetchImpl, timeoutMs, writeFile }) {
  const response = await fetchImpl(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const payload = Buffer.from(await response.arrayBuffer())
  await writeFile(destinationPath, payload)
}

async function validateChecksum(filePath, expectedChecksum, { readFile }) {
  const payload = await readFile(filePath)
  const actualChecksum = createHash('sha256').update(payload).digest('hex')

  if (actualChecksum !== expectedChecksum) {
    throw new DmgHelperPreparationError(
      'CHECKSUM_FAILED',
      `Checksum mismatch for ${path.basename(filePath)}`,
      {
        actualChecksum,
        expectedChecksum,
      },
    )
  }
}

async function extractArchive(archivePath, extractDir, { mkdir, rm, writeFile }) {
  await rm(extractDir, { force: true, recursive: true })
  await mkdir(extractDir, { recursive: true })
  await tar.x({ cwd: extractDir, file: archivePath, strip: 1 })
  await writeFile(`${extractDir}.complete`, '')
}

function classifyAttemptFailure(error) {
  if (error instanceof DmgHelperPreparationError) {
    return error.code
  }

  return 'DOWNLOAD_FAILED'
}

export async function prepareDmgHelper({
  arch = process.arch,
  env = process.env,
  platform = process.platform,
  homeDir = os.homedir(),
  tmpDir = os.tmpdir(),
  fetchImpl = globalThis.fetch,
  logger = defaultLogger(),
  timeoutMs = 120_000,
  fileSystem = fs,
  downloadImpl = downloadToFile,
  extractImpl = extractArchive,
  validateChecksumImpl = validateChecksum,
} = {}) {
  if (!fetchImpl) {
    throw new DmgHelperPreparationError(
      'DOWNLOAD_FAILED',
      'Fetch API is not available in this Node.js runtime.',
    )
  }

  const descriptor = getDmgHelperDescriptor({ arch, env, platform, homeDir, tmpDir })

  if (await pathExists(descriptor.completeMarker, fileSystem)) {
    logger.info(`using cached dmg-builder helper: ${descriptor.extractDir}`)
    return {
      descriptor,
      source: 'cache',
      status: 'cached',
    }
  }

  await fileSystem.mkdir(path.dirname(descriptor.extractDir), { recursive: true })

  const attempts = [
    { label: 'mirror', url: descriptor.mirrorUrl },
    { label: 'official', url: descriptor.officialUrl },
  ]

  const failures = []

  for (const attempt of attempts) {
    const tempArchivePath = path.join(tmpDir, `image-prompt-optimizer-${randomUUID()}.tar.gz`)

    try {
      logger.info(`preparing dmg-builder helper via ${attempt.label}: ${attempt.url}`)
      await downloadImpl(attempt.url, tempArchivePath, {
        fetchImpl,
        timeoutMs,
        writeFile: fileSystem.writeFile.bind(fileSystem),
      })
      await validateChecksumImpl(tempArchivePath, descriptor.checksum, {
        readFile: fileSystem.readFile.bind(fileSystem),
      })
      await extractImpl(tempArchivePath, descriptor.extractDir, {
        mkdir: fileSystem.mkdir.bind(fileSystem),
        rm: fileSystem.rm.bind(fileSystem),
        writeFile: fileSystem.writeFile.bind(fileSystem),
      })
      await fileSystem.rm(tempArchivePath, { force: true })

      logger.info(`dmg-builder helper is ready in cache: ${descriptor.extractDir}`)
      return {
        descriptor,
        source: attempt.label,
        status: 'downloaded',
      }
    } catch (error) {
      failures.push({
        label: attempt.label,
        message: error instanceof Error ? error.message : String(error),
        type: classifyAttemptFailure(error),
        url: attempt.url,
      })
      await fileSystem.rm(tempArchivePath, { force: true }).catch(() => {})
      await fileSystem.rm(descriptor.extractDir, { force: true, recursive: true }).catch(() => {})
      await fileSystem.rm(descriptor.completeMarker, { force: true }).catch(() => {})
      logger.warn(`${attempt.label} attempt failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  throw new DmgHelperPreparationError(
    'OFFICIAL_DOWNLOAD_FAILED',
    'Failed to prepare dmg-builder helper from both mirror and official sources.',
    {
      descriptor,
      failures,
    },
  )
}
