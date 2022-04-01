
let SettingsPage = new Object()

var $light_theme_button = $('#settings-light-theme-button');
var $dark_theme_button = $('#settings-dark-theme-button');

$("#to-settingspage").click(function(event) {
    SettingsPage.Show()
})

$('#settings-home-button').click(function(event) {
    $("#settingspage").removeClass('isActive')
})

$light_theme_button.click(function(event) {
    $('html').addClass("light-theme")
    $('html').removeClass("dark-theme")
    $dark_theme_button.removeClass("chosen")
    $light_theme_button.addClass("chosen")
})

$dark_theme_button.click(function(event) {
    $('html').addClass("dark-theme")
    $('html').removeClass("light-theme")
    $light_theme_button.removeClass("chosen")
    $dark_theme_button.addClass("chosen")
})

SettingsPage.Show = function() {
    if ($('html').hasClass('light-theme')) {
        $light_theme_button.addClass("chosen")
    } else {
        $dark_theme_button.addClass('chosen')
    }
    $("#settingspage").addClass('isActive')

}

export {SettingsPage}