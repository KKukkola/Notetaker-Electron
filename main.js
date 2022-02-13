
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path');
const sqlite3 = require('sqlite3');

/////////// db

let win;
const dbpath = path.join(app.getPath('userData'), "db.db")
let sqlDB = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Connected to the application sqlite database.')
})
sqlDB.run(`CREATE TABLE IF NOT EXISTS events(
    id INTEGER PRIMARY KEY,
    title TEXT,
    starthour INTEGER,
    startmin INTEGER,
    endhour INTEGER,
    endmin INTEGER,
    month INTEGER,
    day INTEGER,
    year INTEGER
);`)

ipcMain.on('query-events', (event, sql) => {
    console.log('ipcMain.on() query-events')
    
    sqlDB.all(sql, [], (err, rows) => {
        win.webContents.send("query-events", rows)
    })
})

ipcMain.on('add-event', (event, eventInfo) => {
    console.log('ipcMain.on() add-event')
    sqlDB.run(`INSERT INTO events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        null,
        eventInfo.eventName, 
        eventInfo.startHour, 
        eventInfo.startMin, 
        eventInfo.endHour,
        eventInfo.endMin,
        eventInfo.month,
        eventInfo.day, 
        eventInfo.year
        )
    
    win.webContents.send("add-event")
})

///////////////////////////

function createWindow() {
    win = new BrowserWindow({
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

ipcMain.on('get-database', function (event, arg) {
    event.returnValue = sqlDB;
    //console.log("GET DATABASE CALLED", db)
    //event.returnValue = db.Open()
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
