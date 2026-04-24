// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createKeychainService } from './keychain'

describe('keychain service', () => {
  it('stores and clears provider keys through the macOS security CLI', async () => {
    const runner = vi.fn().mockResolvedValue({ stdout: '' })
    const service = createKeychainService(runner as never)

    await service.set('openai', 'sk-live')
    await service.clear('openai')

    expect(runner).toHaveBeenNthCalledWith(
      1,
      'security',
      [
        'add-generic-password',
        '-a',
        'provider:openai',
        '-s',
        'com.august1314.image-prompt-optimizer',
        '-w',
        'sk-live',
        '-U',
      ],
      expect.objectContaining({ timeout: 2500 }),
    )
    expect(runner).toHaveBeenNthCalledWith(
      2,
      'security',
      [
        'delete-generic-password',
        '-a',
        'provider:openai',
        '-s',
        'com.august1314.image-prompt-optimizer',
      ],
      expect.objectContaining({ timeout: 2500 }),
    )
  })

  it('does not expose the full key when only checking status', async () => {
    const runner = vi.fn().mockResolvedValue({ stdout: 'sk-live\n' })
    const service = createKeychainService(runner as never)

    await expect(service.has('gemini')).resolves.toBe(true)
    expect(runner).toHaveBeenCalledWith(
      'security',
      [
        'find-generic-password',
        '-a',
        'provider:gemini',
        '-s',
        'com.august1314.image-prompt-optimizer',
        '-w',
      ],
      expect.objectContaining({ timeout: 2500 }),
    )
  })

  it('converts security timeout into a user-facing keychain error', async () => {
    const runner = vi.fn().mockRejectedValue(new Error('Command failed: security timed out'))
    const service = createKeychainService(runner as never)

    await expect(service.get('openai')).rejects.toThrow('Keychain request timed out.')
  })
})
