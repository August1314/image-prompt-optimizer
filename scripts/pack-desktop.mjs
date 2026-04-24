import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const releaseRoot = path.join(projectRoot, 'release')

function runCommand(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      env: process.env,
      stdio: 'inherit',
    })

    child.on('close', (code) => resolve(code ?? 1))
    child.on('error', () => resolve(1))
  })
}

async function collectArtifacts(directory, matcher, bucket = []) {
  let entries = []

  try {
    entries = await fs.readdir(directory, { withFileTypes: true })
  } catch {
    return bucket
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      await collectArtifacts(fullPath, matcher, bucket)
      continue
    }

    if (matcher(fullPath)) {
      bucket.push(fullPath)
    }
  }

  return bucket
}

async function printArtifactSummary(stepName) {
  const appArtifacts = await collectArtifacts(releaseRoot, (targetPath) => targetPath.endsWith('.app'))
  const dmgArtifacts = await collectArtifacts(releaseRoot, (targetPath) => targetPath.endsWith('.dmg'))

  if (appArtifacts.length > 0) {
    console.error(`[pack:desktop] ${stepName}: .app 已生成:`)
    appArtifacts.forEach((artifact) => console.error(`  - ${artifact}`))
  }

  if (dmgArtifacts.length === 0) {
    console.error(`[pack:desktop] ${stepName}: .dmg 尚未生成。`)
  }
}

if (await runCommand('npm', ['run', 'build:desktop'])) {
  console.error('[pack:desktop] build:desktop failed.')
  process.exit(1)
}

if (await runCommand('npm', ['run', 'prepare:dmg-helper'])) {
  console.error('[pack:desktop] 当前失败发生在 helper 准备阶段，Electron Builder 尚未开始生成 .dmg。')
  await printArtifactSummary('prepare:dmg-helper failed')
  process.exit(1)
}

if (await runCommand('./node_modules/.bin/electron-builder', ['--mac', 'dmg'])) {
  console.error('[pack:desktop] Electron Builder failed while packaging DMG.')
  await printArtifactSummary('electron-builder failed')
  process.exit(1)
}
