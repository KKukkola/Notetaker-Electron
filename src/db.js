
// This object communicates with the main process's DB
const {ipcRenderer} = require('electron')
const Files = require("./Files.js")
const path = require('path')

const dbpath = path.join(Files.userdataPath, "db.db")

let db = new Object();

db.AddEvent = function(eventData, onFinish) {
    ipcRenderer.once('add-event', (event) => {
        onFinish()
    })
    ipcRenderer.send('add-event', eventData)
}

db.EachEvent = function(onElement, onFinish, month, day, year) {
    console.log("db.EachEvent: ", month, day, year)
    let sql = `SELECT * FROM events 
        WHERE month = ${month} AND day = ${day} AND year = ${year}
        ORDER BY starthour, startmin`
    ipcRenderer.once('query-events', (event, rows) => {
        rows.forEach(onElement)
        if (onFinish != null ) {
            onFinish()
        }
    })
    ipcRenderer.send("query-events", sql)
}

db.EachEventOfMonth = function(onElement, onFinish, month, year) {
    console.log("db.EachEventOfMonth: ", month, year)
    let sql = `SELECT * FROM events 
        WHERE month = ${month} AND year = ${year}
        ORDER BY day, starthour, startmin`
    ipcRenderer.once('query-events-month', (event, rows) => {
        rows.forEach(onElement)
        if (onFinish != null ) {
            onFinish()
        }
    })
    ipcRenderer.send("query-events-month", sql)
}
 
db.ChangeEvent = function(eventData, onFinish) {
    console.log(eventData)
    ipcRenderer.once('change-event', (event) => {
        onFinish()
    })
    ipcRenderer.send('change-event', eventData)
}

db.RemoveEvent = function(eventData, onFinish) {
    ipcRenderer.once('remove-event', (event) => {
        onFinish()
    })
    ipcRenderer.send('remove-event', eventData)
}

module.exports = db;