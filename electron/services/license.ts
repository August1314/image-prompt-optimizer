import fs from 'fs/promises'
import path from 'path'
import type { BrowserWindow, OpenDialogOptions } from 'electron'
import type { LicenseStatus } from '../../src/lib/desktop-types'
import {
  DEV_LICENSE_PUBLIC_KEY,
  PRODUCTION_LICENSE_PUBLIC_KEY,
  parseLicenseDocument,
  signDevLicense,
  verifyLicenseDocument,
} from '../../src/lib/license-core'

export { signDevLicense }

function resolveDesktopLicensePublicKey() {
  const runtimeKey = process.env.IPO_LICENSE_PUBLIC_KEY_PEM?.trim()
  if (runtimeKey) {
    return runtimeKey
  }

  return process.env.NODE_ENV === 'production' ? PRODUCTION_LICENSE_PUBLIC_KEY : DEV_LICENSE_PUBLIC_KEY
}

export function createLicenseService(
  baseDir: string,
  options?: {
    publicKeyPem?: string
    openDialog?: (window: BrowserWindow, options: OpenDialogOptions) => Promise<{ canceled: boolean; filePaths: string[] }>
  },
) {
  const licenseDir = path.join(baseDir, 'licenses')
  const licensePath = path.join(licenseDir, 'current.lic')
  const publicKeyPem = options?.publicKeyPem ?? resolveDesktopLicensePublicKey()

  async function ensureDir() {
    await fs.mkdir(licenseDir, { recursive: true })
  }

  async function readLicenseStatus(): Promise<LicenseStatus> {
    try {
      const raw = await fs.readFile(licensePath, 'utf8')
      return verifyLicenseDocument(parseLicenseDocument(raw), publicKeyPem)
    } catch {
      return { licensed: false }
    }
  }

  return {
    async status() {
      return readLicenseStatus()
    },
    async importFromFile(sourcePath: string) {
      await ensureDir()
      const raw = await fs.readFile(sourcePath, 'utf8')
      const status = verifyLicenseDocument(parseLicenseDocument(raw), publicKeyPem)
      if (!status.licensed) {
        return status
      }
      await fs.copyFile(sourcePath, licensePath)
      return status
    },
    async importWithDialog(window: BrowserWindow) {
      if (!options?.openDialog) {
        throw new Error('Dialog integration is not configured.')
      }

      const result = await options.openDialog(window, {
        title: 'Import License File',
        properties: ['openFile'],
        filters: [
          { name: 'License Files', extensions: ['lic', 'json'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      })

      if (result.canceled || result.filePaths.length === 0) {
        return this.status()
      }

      return this.importFromFile(result.filePaths[0])
    },
    async clear() {
      try {
        await fs.unlink(licensePath)
      } catch {
        return { licensed: false }
      }
      return { licensed: false }
    },
    getLicensePath() {
      return licensePath
    },
  }
}
