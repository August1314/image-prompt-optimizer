# Desktop Release Runbook

This runbook defines the repeatable macOS packaging workflow for the unsigned `Electron` desktop build.

## Commands

Build renderer + Electron runtime:

```bash
npm run build:desktop
```

Prewarm the `dmg-builder` helper cache:

```bash
npm run prepare:dmg-helper
```

Build the `.dmg`:

```bash
npm run pack:desktop
```

## Mirror and fallback behavior

`prepare:dmg-helper` uses this priority order:

1. `ELECTRON_BUILDER_BINARIES_MIRROR`
2. Default mirror: `https://mirrors.huaweicloud.com/electron-builder-binaries/`
3. Official GitHub release: `https://github.com/electron-userland/electron-builder-binaries/releases/download/`

The helper is currently pinned to:

- release: `dmg-builder@1.2.0`
- archive: `dmgbuild-bundle-<arch>-75c8a6c.tar.gz`

## Cache locations

On this macOS host, the default Electron Builder cache root is:

```text
~/Library/Caches/electron-builder
```

The prewarmed DMG helper is extracted into a subdirectory under:

```text
~/Library/Caches/electron-builder/dmg-builder@1.2.0/
```

If `ELECTRON_BUILDER_CACHE` is set, that environment variable overrides the default cache root.

## How to reset and retry

If you need to force a clean helper download:

1. Remove the cached `dmg-builder@1.2.0` directory under the Electron Builder cache root.
2. Run `npm run prepare:dmg-helper`.
3. Then run `npm run pack:desktop`.

If you want to test a different mirror:

```bash
ELECTRON_BUILDER_BINARIES_MIRROR="https://your-mirror.example.com/electron-builder-binaries/" npm run prepare:dmg-helper
```

## Expected outputs

After a successful `npm run pack:desktop`, both artifacts should exist:

- `release/mac-arm64/Image Prompt Optimizer.app`
- `release/ImagePromptOptimizer-<version>.dmg`

If `electron-builder` fails after `.app` is already produced, the packaging wrapper prints that `.app` is available and `.dmg` is still missing.

## Current v1 boundary

- packaging is `macOS-only`
- output is unsigned / ad-hoc
- notarization is intentionally out of scope
- provider keys stay in `macOS Keychain`
- local license import continues to use `userData/licenses/current.lic`

## Installation expectation

The generated DMG is intended for local-first distribution:

1. double-click the `.dmg`
2. drag `Image Prompt Optimizer.app` into `Applications`
3. launch the app manually
4. configure provider keys inside the desktop settings panel

Because this v1 output is unsigned and not notarized, macOS may show additional trust prompts on first launch.
