let Delta = Quill.import('delta');

import {FileBrowser} from "./FileBrowser.js";

let Notepad = new Object()

let $notepad = $('#notepad')
let $tabsContainer = $('#notepad-top')

/////////////////////////////////

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
        tabObj.$e.on('click', (event) => { TabClicked(event, tabObj) })
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

    SetActive: function(tabObj) {
        if (tabObj == this.cTab) {
            console.log("activated tab is already activated")
            return;
        }
        if (this.cTab !== null) {
            this.cTab.SetActive(false)
        }
        if (tabObj == null) { // if we are closing the last tab
            this.cTab = null
            FileBrowser.SetActive(null)
            return
        }
        this.cTab = tabObj
        this.cTab.SetActive(true)
        FileBrowser.SetActive(this.cTab.path)
    },
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

    SetActive(v) {
        if (v == false) {
            this.$e.removeClass('tab-div-active')
            this.$body.removeClass('active')
        } else {
            this.$e.addClass('tab-div-active')
            this.$body.addClass('active')
        }
    }

    Destroy() {
        this.$e.remove();
        this.$body.remove();
    }
}

////////////////////////////////////

// Tab Clicked
function TabClicked(event, tabObj) {
    // if this is not the active tab
    if (Tabs.cTab != tabObj) {
        Tabs.SetActive(tabObj)
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
            let nextTabObj = Tabs.FindFor($nextTab.data('filepath'))
            if (nextTabObj == tabObj) {
                Tabs.SetActive(null)
            } else {
                Tabs.SetActive(nextTabObj)
            }
        } else {

        }
    } else {

    }
    Tabs.Remove(tabObj)
}

///////////////////////////////////////

function NewQuill(element) {
    var bindings = { 
        linebreak: {
            key: 13,
            altKey: true,
            handler: function(range, context) {
                if (context.empty || context.offset === 0) {
                    this.quill.insertEmbed(range.index, 'pagebreak', true, Quill.sources.USER);
                    this.quill.setSelection(range.index + 1, Quill.sources.SILENT);       
                    return;
                }
                this.quill.insertText(range.index, '\n', Quill.sources.USER);
                this.quill.insertEmbed(range.index + 1, 'pagebreak', true, Quill.sources.USER);
                this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
            }
        }
    }
    let thisQuill = new Quill(element,{
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', {
                        'color': []
                    }, {
                        "background": []
                    }, 
                    // { "font": []}, 
                    {
                        "size": []
                    }, {
                        align: []
                    }, 
                ],
            ],
            keyboard: {
                bindings: bindings,
            }
        },
        scrollingContainer: $(element).parent().get(0),
        theme: "snow"
    });

    thisQuill.on('selection-change', function(range, oldRange, source) {
        if (range == null) return;
        const currentLeaf = thisQuill.getLeaf(range.index)[0];
        const nextLeaf = thisQuill.getLeaf(range.index + 1)[0];    
        if (currentLeaf.parent.constructor.name == "PageBreakBlot") {
            let nextIndex = range.index;
            if (oldRange) {
                let prevIndex = oldRange.index;
                if (nextIndex > prevIndex) {
                    thisQuill.setSelection(nextIndex + 1, Quill.sources.SILENT);
                } else {
                    thisQuill.setSelection(nextIndex - 1, Quill.sources.SILENT);
                }
            }
        }
    });
    
    return thisQuill; 
}

///////////////////////////////////////

Notepad.NotePathChanged = function(lastPath, newPath) {
    for (let path in Tabs.allTabs) {
        let tabObj = Tabs.allTabs[path]
        if (path.indexOf(lastPath) !== -1) {
            let newTabPath = path.replace(lastPath, newPath)
            let oldTabPath = tabObj.path
            tabObj.path = newTabPath
            Tabs.allTabs[newTabPath] = tabObj;
            Tabs.allTabs[oldTabPath] = null;
            delete Tabs.allTabs[oldTabPath];
            console.log("now all the tabs: ", Tabs.allTabs)
        }
    }
}

Notepad.NoteDeleted = function(notePath) {
    let allDeleted = false
    while (!allDeleted) {
        allDeleted = true
        for (let path in Tabs.allTabs) {
            let tabObj = Tabs.allTabs[path]
            if (path.indexOf(notePath) !== -1) {
                allDeleted = false
                // switch to the next tab
                if (Tabs.cTab == tabObj) { 
                    let index = tabObj.$e.index();
                    let $nextTab = $tabsContainer.children().eq(index+1)
                    if ($nextTab.length == 0) {
                        $nextTab = $tabsContainer.children().eq(index-1)
                    }
                    if ($nextTab.length > 0) {
                        let nextTabObj = Tabs.FindFor($nextTab.data('filepath'))
                        if (nextTabObj == tabObj) {
                            Tabs.SetActive(null)
                        } else {
                            Tabs.SetActive(nextTabObj)
                        }
                    }    
                }
                //
                Tabs.Remove(tabObj)
            }
        }
    }
}

Notepad.FolderPathChanged = function(lastPath, newPath) {
    console.log(lastPath)
    console.log(newPath)
    
}

Notepad.Refresh = () => {
    // TODO: open last session notes
}

Notepad.Open = function(filepath) {
    let tabObj = Tabs.FindFor(filepath) || Tabs.NewTabFor(filepath)
    Tabs.SetActive(tabObj)
    return tabObj
}

Notepad.Save = function() {
    if (Tabs.cTab == null) { return; }

    const data = JSON.stringify(Tabs.cTab.Quill.getContents())
    fs.OverwriteFile(Tabs.cTab.path, data, function() {
        console.log("*Save Successfull")
    })
}

export {Notepad}