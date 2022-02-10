
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

db.EachEvent = function(onElement, onFinish, month, day) {
    console.log("db.EachEvent:", month, day)
    let sql = `SELECT * FROM events 
        WHERE month = ${month} AND day = ${day} 
        ORDER BY starthour, startmin`
    ipcRenderer.once('query-events', (event, rows) => {
        rows.forEach(onElement)
        if (onFinish != null ) {
            onFinish()
        }
    })
    ipcRenderer.send("query-events", sql)
}

module.exports = db;