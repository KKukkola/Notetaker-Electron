
// This object communicates with the main process's DB
const {ipcRenderer} = require('electron')
const Files = require("./Files.js")
const path = require('path')

const dbpath = path.join(Files.userdataPath, "db.db")

let db = new Object();

db.AddEvent = function(eventData, onFinish) {
    // let sql = "INSERT INTO events VALUES (?, ?, ?, ?)", title, sHour, eHour, PMorAM,
    //sqlDB.run(`INSERT INTO events VALUES (?, ?, ?, ?, ?)`, random, title, sHour, eHour, PMorAM)
    //takes title, starthour, startmin, endhour, endmin, month, day
    ipcRenderer.once('add-event', (event) => {
        onFinish()
    })
    ipcRenderer.send('add-event', eventData)
}

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