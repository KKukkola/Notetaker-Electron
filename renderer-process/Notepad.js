
let Delta = Quill.import('delta');

let Notepad = new Object()

let $notepad = $('#notepad')
let $tabsContainer = $('#notepad-top')

let Tabs = {
    allTabs: {},
    cTab: null,

    FindFor: function(filepath) {
        let tabObj = this.allTabs[filepath];
        if (tabObj != null) {
            return tabObj;
        }
        return null;
    },

    NewTabFor: function(filepath) {
        let tabObj = new Tab(filepath)
        tabObj.$e.on('click', (event) => { TabClicked(event, tabObj.$e) })
        tabObj.$e.find('.close-tab').first().on('click', (event) => { TabCloseClicked(event, tabObj)})
        this.allTabs[filepath] = tabObj
        return tabObj;
    },

    Remove: function(tabObj) {
        if (Tabs.allTabs[tabObj.path] == null) { 
            console.error('Tabs.Remove() null tab'); 
            return; 
        }
        tabObj.Destroy()
        delete Tabs.allTabs[tabObj.path]
    },

    SetActive: function() {

    }
}

/////////////////////////////////

class Tab {
    $e = null;
    $body = null;
    path = null;
    Quill = null;

    constructor(filepath) {
        let title = filepath.slice(filepath.lastIndexOf('\\') + 1)
        // Create the Tab
        let $tab = $($("#template-tab-div").html())
        $tab.data('filepath', filepath)
        $tab.find('span').first().html(title)
        
        // Creating the Body
        let $body = $($("#template-notepad-body").html())
        let quill = NewQuill($body.find('.quill-editor').get(0))
        let $editorcontainer = $body.find('.quill-editor-container')
        $editorcontainer.height($notepad.height()-90)
        
        // Fill with text
        fs.ReadFile(filepath, function(text) {
            quill.setContents(JSON.parse(text))
        })
        
        $tab.appendTo($tabsContainer)
        $body.appendTo($notepad)

        this.$e = $tab;
        this.$body = $body;
        this.path = filepath;
        this.Quill = quill;
    }

    Destroy() {
        this.$e.remove();
        this.$body.remove();
    }
}

////////////////////////////////////

// Tab Clicked
function TabClicked(event, $tab) {
    // if this is not the active tab
    if (Tabs.cTab.path !== $tab.data('filepath')) {
        ActivateTab($tab)
    }
}

// Tab Closed
function TabCloseClicked(event, tabObj) {
    event.stopPropagation();
    let index = tabObj.$e.index();
    let path = tabObj.path;
    // Activate the next tab (either +1 or -1 to the index) if active
    if (Tabs.cTab == tabObj) { 
        let $nextTab = $tabsContainer.children().eq(index+1)
        if ($nextTab.length == 0) {
            $nextTab = $tabsContainer.children().eq(index-1)
        }
        if ($nextTab.length > 0) {
            ActivateTab($nextTab)
        } else {

        }
    } else {

    }
    Tabs.Remove(tabObj)
}

///////////////////////////////////////

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

function ActivateTab($tab) {
    let tabObj = Tabs.allTabs[$tab.data('filepath')]
    if (tabObj == Tabs.cTab) {
        console.log("issue? - activated tab is the activePath, returining")
        return;
    }

    // Deactivate last tab
    if (Tabs.cTab !== null) {
        Tabs.cTab.$e.removeClass('tab-div-active')
        Tabs.cTab.$body.removeClass('active')
    }

    // Activate this one
    Tabs.cTab = Tabs.allTabs[$tab.data('filepath')]
    Tabs.cTab.$e.addClass('tab-div-active')
    Tabs.cTab.$body.find('.quill-editor-container').height($notepad.height()-90)
    Tabs.cTab.$body.addClass('active')

}

///////////////////////////////////////

Notepad.Refresh = () => {
    // let change = new Delta();
    // Notepad.Quill.on('text-change', function(delta) {
    //     change = change.compose(delta)
    // })
    function resizewindow(e) {
        if (Tabs.cTab == null) { console.log('none to resize'); return; }
        Tabs.cTab.$body.find('.quill-editor-container').height($notepad.height()-90)
    }
    window.addEventListener('resize', resizewindow, true)
}

Notepad.Open = function(filepath) {
    console.log("Notepad.Open")
    
    let tabObj = Tabs.FindFor(filepath) || Tabs.NewTabFor(filepath)
    
    ActivateTab(tabObj.$e)
}

Notepad.Save = function() {
    if (Tabs.cTab == null) { return; }

    console.log("TODO: SAVE")
    
    const data = JSON.stringify(Tabs.cTab.Quill.getContents())
    fs.OverwriteFile(Tabs.cTab.path, data, function() {
        console.log("*Save Successfull")
    })
}

export {Notepad}