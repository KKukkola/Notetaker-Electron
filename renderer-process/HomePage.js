
import {CalendarPage} from "./CalendarPage.js"
import {SettingsPage} from "./SettingsPage.js"

let HomePage = new Object()

$('#to-homepage').click(function(event) {
    $("#homepage").addClass('isActive')
})

$('#h-notepad-btn').click(function(event) {
    $("#homepage").removeClass('isActive')
})

$('#h-calendar-btn').click(function(event) {
    CalendarPage.Show()
    $("#homepage").removeClass('isActive')
})

$('#h-settings-btn').click(function(event) {
    SettingsPage.Show()
    $("#homepage").removeClass('isActive')
})

export {HomePage} 