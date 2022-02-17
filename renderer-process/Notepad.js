
let Notepad = new Object()
Notepad.currentFile = null

Notepad.Refresh = () => {
    console.log("TODO: Notepad Refresh")
}

Notepad.Open = function(filepath) {
    console.log("Notepad.Open")
    // fs.ReadFile(filepath, function(text) {
    //     console.log("this is the text:", text)
    //     Notepad.currentFile = filepath
    //     $('#notepad-textarea').val(text)
    // })
}

Notepad.Save = function() {
    console.log("Notepad.Save")
    // if (Notepad.currentFile !== null) {
    //     let text = $('#notepad-textarea').val() 
    //     console.log("Tet=xt: ", text)
    //     fs.OverwriteFile(Notepad.currentFile, text, function() {
    //         console.log("Successfull save!")
    //     })
    // }
}

export {Notepad}