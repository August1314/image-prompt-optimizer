import path from 'path'
import { app, BrowserWindow, dialog, ipcMain, Menu } from 'electron'
import { registerDesktopIpcHandlers } from './ipc'
import { createKeychainService } from './services/keychain'
import { createLicenseService } from './services/license'
import { createDesktopOptimizer } from './services/optimizer'
import { createSettingsStore } from './services/settings'
import { testProviderConnection } from '../src/lib/optimize-core'

let mainWindow: BrowserWindow | null = null

function createMainWindow() {
  const preloadPath = path.join(__dirname, 'preload.cjs')
  const window = new BrowserWindow({
    width: 1180,
    height: 900,
    minWidth: 980,
    minHeight: 760,
    backgroundColor: '#0f0f0f',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  const rendererUrl = process.env.ELECTRON_RENDERER_URL
  if (rendererUrl) {
    void window.loadURL(rendererUrl)
  } else {
    void window.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  return window
}

async function bootstrap() {
  const userDataPath = app.getPath('userData')
  const settingsStore = createSettingsStore(userDataPath)
  const keychainService = createKeychainService()
  const desktopOptimizer = createDesktopOptimizer({
    getSettings: () => settingsStore.getSettings(),
    getSecret: (provider) => keychainService.get(provider),
  })

  mainWindow = createMainWindow()

  const licenseService = createLicenseService(userDataPath, {
    openDialog: (window, options) => dialog.showOpenDialog(window, options),
  })

  registerDesktopIpcHandlers({
    ipcMain,
    mainWindow,
    settingsStore,
    keychainService,
    desktopOptimizer,
    testProviderConnection: async (input) => {
      await testProviderConnection({
        providerConfig: {
          provider: input.provider,
          apiKey: input.apiKey,
          model: input.model,
        },
      })
    },
    licenseService,
  })

  const menu = Menu.buildFromTemplate([
    {
      label: 'Application',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'File',
      submenu: [{ role: 'close' }],
    },
    {
      label: 'Edit',
      submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'copy' }, { role: 'paste' }],
    },
    {
      label: 'View',
      submenu: [{ role: 'reload' }, { role: 'toggleDevTools' }],
    },
  ])
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(bootstrap)

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    void bootstrap()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
