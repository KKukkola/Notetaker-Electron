
let HomePage = new Object()

$('#to-homepage').click(function(event) {
    $("#homepage").addClass('isActive')
})

$('#h-notepad-btn').click(function(event) {
    console.log("notes button clicked!");
})

$('#h-calendar-btn').click(function(event) {
    console.log("Calendar button clicked!");
})

$('#h-settings-btn').click(function(event) {
    console.log("Settings button clicked!");
})

export {HomePage} 