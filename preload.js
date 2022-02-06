
// Preload runis in the renderer processes but with access
// to Node runtime and the browser's 'window' obj
// No access to electron.app

const { contextBridge, ipcRenderer } = require("electron")
const Files = require('./src/Files.js')
const db = require('./src/db.js')

// window.addEventListener('DOMContentLoaded', () => {
//     const replaceText = (selector, text) => {
//         const element = document.getElementById(selector)
//         if (element) element.innerText = text
//     }

//     for (const dependency of ['chrome', 'node', 'electron']) {
//         replaceText(`${dependency}-version`, process.versions[dependency])
//     }
// })

contextBridge.exposeInMainWorld('fs', Files)
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
contextBridge.exposeInMainWorld('db', db)
contextBridge.exposeInMainWorld('projectdir', __dirname)

// contextBridge.exposeInMainWorld(
//     "api", {
//         send: (channel, data) => {
//             //let validChannels = ["toMain"]; 
//             //if (validChannels.includes(channel)) {
//                 ipcRenderer.send(channel, data);
//             //}
//         },
//         receive: (channel, func) => {
//             // let validChannels = ["fromMain"];
//             // if (validChannels.includes(channel)) {
//                 ipcRenderer.on(channel, (event, ...args) => func(...args));
//             // }
//         }
//     }
// );

ipcRenderer.on('context-menu-command', (event, command) => {
    
})
