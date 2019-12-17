'use strict'

const { app, BrowserWindow } = require('electron')

let mainWindow

const createMainWindow = async () => {
  const win = new BrowserWindow({
    title: app.name,
    show: false,
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.on('ready-to-show', () => win.show())
  win.on('closed', () => (mainWindow = undefined))
  if (!process.env.CI) win.webContents.openDevTools()
  await win.loadURL(`file://${__dirname}/static/index.html`)
  return win
}

if (!app.requestSingleInstanceLock) app.quit()

app.on('second-instance', () => {
  if (!mainWindow) return
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' || process.env.CI) {
    app.quit()
  }
})

app.on('activate', async () => {
  if (!mainWindow) mainWindow = await createMainWindow()
})

const main = async () => {
  await app.whenReady()
  mainWindow = await createMainWindow()
}

main()
