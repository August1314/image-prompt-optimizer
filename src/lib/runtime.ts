export function isDesktopRuntime() {
  return typeof window !== 'undefined' && typeof window.desktopApi !== 'undefined'
}
