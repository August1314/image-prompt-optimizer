import { contextBridge, ipcRenderer } from 'electron'
import { createDesktopApiBridge } from './preload.api'

contextBridge.exposeInMainWorld('desktopApi', createDesktopApiBridge(ipcRenderer.invoke.bind(ipcRenderer)))
