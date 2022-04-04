
import {Notepad} from "./Notepad.js";

let keydowns = new Object();

$(document).keydown(function(event) {
    keydowns[event.which] = true
    if (keydowns[17] && keydowns[83]) {
        Notepad.Save()
    }
})
$(document).keyup(function(event) {
    keydowns[event.which] = false
})

export {keydowns}