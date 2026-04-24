import type { DesktopApi } from '../lib/desktop-types'

declare global {
  interface Window {
    desktopApi?: DesktopApi
  }
}

export {}
