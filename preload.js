
// Preload runis in the renderer processes but with access
// to Node runtime and the browser's 'window' obj
// No access to electron.app

const { contextBridge, ipcRenderer } = require("electron")
const Files = require('./src/Files.js')
const db = require('./src/db.js')

contextBridge.exposeInMainWorld('fs', Files)
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
contextBridge.exposeInMainWorld('db', db)
contextBridge.exposeInMainWorld('projectdir', __dirname)

ipcRenderer.on('context-menu-command', (event, command) => {
    
})
