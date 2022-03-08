
let SettingsPage = new Object()

$("#to-settingspage").click(function(event) {
    $("#settingspage").addClass('isActive')
})

$('#settings-home-button').click(function(event) {
    $("#settingspage").removeClass('isActive')
})

$("#settings-light-theme-button").click(function(event) {
    $('html').addClass("light-theme")
    $('html').removeClass("dark-theme")
})

$("#settings-dark-theme-button").click(function(event) {
    $('html').addClass("dark-theme")
    $('html').removeClass("light-theme")
})

export {SettingsPage}