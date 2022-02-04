
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    })

    win.loadFile('index.html')

    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// https://stackoverflow.com/questions/65851796/how-do-i-make-a-database-call-from-an-electron-front-end
// No need for IPC for files or db
// Because those APIs are available in the preload. 
// IPC only required if you want to manipulate windows or trigger
// anything else on the main process from the renderer process

ipcMain.handle('get-user-data-path', async (event) => {
    const path = app.getPath('userData')
    return path;
})

ipcMain.on('synchronous-message', (event, arg) => {
    const userdataPath = app.getPath('userData')
    event.returnValue = userdataPath;
})

// // main
// ipcMain.on('show-context-menu', (event) => {
//     const template = [
//         {
//             label: 'Menu Item 1',
//             click: () => { event.sender.send('context-menu-command', 'menu-item-1') }
//         },
//         { type: 'separator' },
//         { label: 'Menu Item 2', type: 'checkbox', checked: true }
//     ]
//     const menu = Menu.buildFromTemplate(template)
//     menu.popup(BrowserWindow.fromWebContents(event.sender))
// })

// can include the rest of your app's specific main [rocess
// code. you can also put them in separate files and require them here

console.log("Main Process Done")
