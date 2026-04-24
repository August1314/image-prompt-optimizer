import { prepareDmgHelper, DmgHelperPreparationError } from './prepare-dmg-helper-lib.mjs'

try {
  const result = await prepareDmgHelper()
  console.log(`[prepare:dmg-helper] status=${result.status} source=${result.source}`)
  console.log(`[prepare:dmg-helper] cache=${result.descriptor.extractDir}`)
} catch (error) {
  console.error('[prepare:dmg-helper] failed to prepare dmg-builder helper.')

  if (error instanceof DmgHelperPreparationError) {
    const { descriptor, failures } = error.details ?? {}

    if (descriptor) {
      console.error(`[prepare:dmg-helper] cache directory: ${descriptor.extractDir}`)
      console.error(`[prepare:dmg-helper] mirror url: ${descriptor.mirrorUrl}`)
      console.error(`[prepare:dmg-helper] official url: ${descriptor.officialUrl}`)
    }

    for (const failure of failures ?? []) {
      const localizedType = {
        ARCH_MISMATCH: '架构不匹配',
        CACHE_WRITE_FAILED: '缓存写入失败',
        CHECKSUM_FAILED: '校验失败',
        DOWNLOAD_FAILED: '下载失败',
        MIRROR_DOWNLOAD_FAILED: '镜像下载失败',
        OFFICIAL_DOWNLOAD_FAILED: '官方下载失败',
      }[failure.type] || failure.type

      console.error(`[prepare:dmg-helper] ${failure.label}: ${localizedType} -> ${failure.message}`)
    }
  } else {
    console.error(error instanceof Error ? error.message : String(error))
  }

  process.exitCode = 1
}
