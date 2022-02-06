
// This object communicates with the main process's DB
const {ipcRenderer} = require('electron')
const Files = require("./Files.js")
const path = require('path')

const dbpath = path.join(Files.userdataPath, "db.db")

let db = new Object();

// db.AddEvent = function(title, sHour, eHour, PMorAM, onFinish) {

//     let random = Math.floor(1000000 * Math.random())
//     sqlDB.run(`INSERT INTO events VALUES (?, ?, ?, ?, ?)`, random, title, sHour, eHour, PMorAM)

//     onFinish()
// }

db.EachEvent = function(onElement, onFinish) {
    let sql = "SELECT * FROM events"
    ipcRenderer.once('query-events', (event, rows) => {
        rows.forEach(onElement)
        if (onFinish != null ) {
            onFinish()
        }
    })
    ipcRenderer.send("query-events", sql)
}

ipcRenderer.on('EachEvent', (err, rows) => {

})

module.exports = db;