import { execFile } from 'child_process'
import { promisify } from 'util'
import type { AIProvider } from '../../src/lib/types'

const SERVICE_NAME = 'com.august1314.image-prompt-optimizer'
const SECURITY_COMMAND_TIMEOUT_MS = 2500
const execFileAsync = promisify(execFile)

type Runner = (
  file: string,
  args: string[],
  options?: {
    timeout?: number
    maxBuffer?: number
  },
) => Promise<{ stdout: string; stderr?: string }>

function getAccount(provider: AIProvider) {
  return `provider:${provider}`
}

function isNotFoundError(error: unknown) {
  return error instanceof Error && /could not be found|The specified item could not be found/i.test(error.message)
}

function isTimeoutError(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }

  return /timed out|ETIMEDOUT|SIGTERM/i.test(error.message)
}

export function createKeychainService(
  runner: Runner = execFileAsync,
) {
  async function runSecurity(args: string[]) {
    return runner('security', args, {
      timeout: SECURITY_COMMAND_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
    })
  }

  return {
    async set(provider: AIProvider, apiKey: string) {
      await runSecurity([
        'add-generic-password',
        '-a',
        getAccount(provider),
        '-s',
        SERVICE_NAME,
        '-w',
        apiKey,
        '-U',
      ])
    },
    async clear(provider: AIProvider) {
      try {
        await runSecurity([
          'delete-generic-password',
          '-a',
          getAccount(provider),
          '-s',
          SERVICE_NAME,
        ])
      } catch (error) {
        if (!isNotFoundError(error)) {
          throw error
        }
      }
    },
    async get(provider: AIProvider): Promise<string | null> {
      try {
        const { stdout } = await runSecurity([
          'find-generic-password',
          '-a',
          getAccount(provider),
          '-s',
          SERVICE_NAME,
          '-w',
        ])
        return stdout.trim() || null
      } catch (error) {
        if (isNotFoundError(error)) {
          return null
        }
        if (isTimeoutError(error)) {
          throw new Error('Keychain request timed out.')
        }
        throw error
      }
    },
    async has(provider: AIProvider) {
      const key = await this.get(provider)
      return Boolean(key)
    },
  }
}
