
let Delta = Quill.import('delta');

let Notepad = new Object()

let $tabsContainer = $('#notepad-top')

let ActiveTab = new Object();
ActiveTab.path = null;
ActiveTab.element = null;

function CreateTabFor(filepath) {
    let $clone = $($("#template-tab-div").html())
    $clone.data('filepath', filepath)
    $clone.find('span').first().html('title')

    $clone.appendTo($tabsContainer)

    $clone.on('click', function() {
        console.log('tab-clicked!')
        if (ActiveTab.path !== $clone.data('filepath')) {
            ActivateTab($clone)
        }
    })

    $clone.find('.close-tab').first().on('click', function(event) {
        event.stopPropagation();
        let index = $clone.index();
        // Activate the next tab (either +1 or -1 to the index) if active
        if (ActiveTab.path == $clone.data('filepath')) { 
            console.log("WAS ACTIVE")
            let $nextTab = $tabsContainer.children().eq(index+1)
            if ($nextTab.length == 0) {
                $nextTab = $tabsContainer.children().eq(index-1)
            }
            if ($nextTab.length > 0) {
                ActivateTab($nextTab)
            } else {
            }
        } else {
            console.log("NOT ACTIVE")
        }
        $clone.remove()
    })

    return $clone;
}

function ActivateTab($tab) {
    if ($tab.data('filepath') == ActiveTab.path) {
        console.log("issue? - activated tab is the activePath, returining")
        return;
    }

    if (ActiveTab.element !== null) {
        ActiveTab.element.removeClass('tab-div-active')
    }

    ActiveTab.path = $tab.data('filepath')
    ActiveTab.element = $tab
    ActiveTab.element.addClass('tab-div-active')

    fs.ReadFile(ActiveTab.path, function(text) {
        Notepad.Quill.setContents(JSON.parse(text))
    })
}

function StartQuill() {
    Notepad.Quill = new Quill("#editor",{
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', {
              'color': []
              }, {
                  "background": []
                }, {
                    "font": []
                }, {
                    "size": []
                }, {
                    align: []
                }, 'image', 'code-block']]
            },
            scrollingContainer: "#editorcontainer",
            theme: "snow"
    });

    // let change = new Delta();
    // Notepad.Quill.on('text-change', function(delta) {
    //     change = change.compose(delta)
    // })

    // Watch Size
    let $notepad = $('#notepad')
    let $editorcontainer = $('#editorcontainer')
    $editorcontainer.height($notepad.height()-90)
    window.addEventListener('resize', function(event) {
        $editorcontainer.height($notepad.height()-90)
    }, true);
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
    StartQuill()
}

Notepad.Open = function(filepath) {
    console.log("Notepad.Open")
    
    let $tab = GetTabFor(filepath) || CreateTabFor(filepath)
    
    ActivateTab($tab)
}

Notepad.Save = function() {
    if (ActiveTab.path !== null) {
        console.log("TODO: SAVE")
        const data = JSON.stringify(Notepad.Quill.getContents())
        console.log(data)
        fs.OverwriteFile(ActiveTab.path, data, function() {
            console.log("Successfull save!")
        })
    }
}

export {Notepad}