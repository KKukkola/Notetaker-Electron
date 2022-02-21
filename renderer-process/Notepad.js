
let Delta = Quill.import('delta');

let Notepad = new Object()

let $notepad = $('#notepad')
let $tabsContainer = $('#notepad-top')

let Tabs = {}
Tabs.allTabs = {} // [path]
Tabs.cTab = {
    $e: null,
    $body: null,
    path: null,
    Quill: null,
}

let ActiveTab = new Object();
ActiveTab.path = null;
ActiveTab.element = null;

function RemoveTab(filepath) {
    console.log(Tabs.allTabs, filepath)
    let tabObj = Tabs.allTabs[filepath]
    if (tabObj == null) { console.error('RemoveTab() null tab'); return; }
    tabObj.$e.remove()
    tabObj.$body.remove()
    delete Tabs.allTabs[filepath]

    // if there are no tabs open
    let numTabs = Object.keys(Tabs.allTabs).length
    if (numTabs === 0) {
        console.log("THERE ARE NO TABS OPEN")
        //$('#notepad-bottom').css('display', 'none')
    }
}

function CreateTabFor(filepath) {
    let $clone = $($("#template-tab-div").html())
    $clone.data('filepath', filepath)
    $clone.find('span').first().html('title')

    $clone.appendTo($tabsContainer)

    $clone.on('click', function() {
        console.log('tab-clicked!')
        // if this is not the active tab
        if (Tabs.cTab.path !== $clone.data('filepath')) {
            ActivateTab($clone)
        }
    })

    $clone.find('.close-tab').first().on('click', function(event) {
        event.stopPropagation();
        let index = $clone.index();
        let path = $clone.data('filepath')
        // Activate the next tab (either +1 or -1 to the index) if active
        if (Tabs.cTab.path == path) { 
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
        RemoveTab(path)
    })

    // Creating the text-editor portion
    let $body = $($("#template-notepad-body").html())
    $body.appendTo($notepad)
    let quill = NewQuill($body.find('.quill-editor').get(0))
    
    // Set Size
    let $editorcontainer = $body.find('.quill-editor-container')
    $editorcontainer.height($notepad.height()-90)

    Tabs.allTabs[filepath] = {
        path: filepath,
        $e: $clone,
        $body: $body,
        Quill: quill,
    }

    // Fill the info
    fs.ReadFile(filepath, function(text) {
        // quill.setText('here is the test text')
        quill.setContents(JSON.parse(text))
    })
    
    console.log(Tabs)

    return $clone;
}

function ActivateTab($tab) {
    if ($tab.data('filepath') == Tabs.cTab.path) {
        console.log("issue? - activated tab is the activePath, returining")
        return;
    }

    // Deactivate last tab
    if (Tabs.cTab.$e !== null) {
        Tabs.cTab.$e.removeClass('tab-div-active')
        Tabs.cTab.$body.removeClass('active')
    }

    // Activate this one
    Tabs.cTab = Tabs.allTabs[$tab.data('filepath')]
    Tabs.cTab.$e.addClass('tab-div-active')
    Tabs.cTab.$body.find('.quill-editor-container').height($notepad.height()-90)
    Tabs.cTab.$body.addClass('active')

}

function NewQuill(element) {
    return new Quill(element,{
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
}

function GetTabFor(filepath) {
    // TODO: UPDATE
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
    // let change = new Delta();
    // Notepad.Quill.on('text-change', function(delta) {
    //     change = change.compose(delta)
    // })
    function resizewindow(e) {
        if (Tabs.cTab.path === null) { console.log('none to resize'); return; }
        Tabs.cTab.$body.find('.quill-editor-container').height($notepad.height()-90)
        // $editorcontainer.height($notepad.height()-90)
    }
    window.addEventListener('resize', resizewindow, true)
}

Notepad.Open = function(filepath) {
    console.log("Notepad.Open")
    
    let $tab = GetTabFor(filepath) || CreateTabFor(filepath)
    
    ActivateTab($tab)
}

Notepad.Save = function() {
    if (Tabs.cTab.path == null) { return; }

    console.log("TODO: SAVE")
    
    const data = JSON.stringify(Tabs.cTab.Quill.getContents())
    fs.OverwriteFile(Tabs.cTab.path, data, function() {
        console.log("*Save Successfull")
    })
}

export {Notepad}