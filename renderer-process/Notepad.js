
let Notepad = new Object()
Notepad.currentFile = null

Notepad.openNotes = new Object();

let $tabsContainer = $('#notepad-top')

function CreateTabFor(filepath) {
  let $clone = $($("#template-tab-div").html())
  $clone.data('filepath', filepath)
  $clone.find('span').first().html('title')

  console.log("appending..")
  $clone.appendTo($tabsContainer)

  $clone.on('click', function() {
    console.log('tab-clicked!')
  })

  $clone.find('.close-tab').first().on('click', function(event) {
    event.stopPropagation();
    $clone.remove();
  })

  return $clone;
}

function GetTabFor(filepath) {
    let $tab = null;
    $tabsContainer.find('.tab-div').each(function(index) {
        let $e = $(this)
        if ($e.data('filepath') === filepath) {
            $tab = $e;
        }
    })
    return $tab;
}


Notepad.Refresh = () => {
    console.log("TODO: Notepad Refresh")
}

Notepad.Open = function(filepath) {
    console.log("Notepad.Open")
    
    let $tab = GetTabFor(filepath)
    
    if ($tab !== null) {
        console.log("HAS THAT TAB");
    } else {
        console.log("NOT HAS THAT TAB")
        CreateTabFor(filepath)
    }

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