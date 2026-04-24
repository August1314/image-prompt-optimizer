import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    main: 'electron/main.ts',
    preload: 'electron/preload.ts',
  },
  clean: true,
  dts: false,
  format: ['cjs'],
  outDir: 'dist-electron',
  platform: 'node',
  sourcemap: true,
  target: 'node20',
  external: ['electron'],
  outExtension() {
    return { js: '.cjs' }
  },
})
