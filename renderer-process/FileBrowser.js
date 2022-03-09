// 1-27-2022

import {ContextMenu} from "./ContextMenu.js"
import {Notepad} from "./Notepad.js";

let FileBrowser = new Object();
let closedFolders = new Object();

let $filebrowserbody = $('#fb-body')

const BASE_PADDING = 15;
const PADDING_INCREASE = 10;

const folderOpenIcon = "fas fa-folder-open"
const folderClosedIcon = "fas fa-folder"
const noteIcon = "far fa-file-alt"

let FBItems = {
  allItems: {},
  activeItem: null,

  FindFor: function(path) {
    return this.allItems[path] || null
  },

  NewItem: function(name, path, $parent, padding) {
    let item = new FBItem(name, path, $parent, padding)

    item.$button.mousedown(event => {
      switch(event.which) {
        case 1: ItemLeftClick(event, item); break;
        case 3: ItemRightClick(event, item); break;
      }
    })

    item.$button.mousedown(event => { ItemDrag(event, item) })

    this.allItems[item.path] = item;
    return item;
  },

  SaveOpened: function() {
    closedFolders = new Object();
    for (let path in this.allItems) {
      let item = this.allItems[path]
      closedFolders[item.path] = item.isClosed;
    }
  },

  SetActiveItem: function(item) {
    if (this.activeItem != null) {
      this.activeItem.SetActive(false)
    }
    this.activeItem = item;
    if (item != null && !item.isFolder) {
      item.SetActive(true)
    }
  },
}

//////////////////////////////////////////

class FBItem {
  $e = null;
  $section = null;
  $icon = null;
  $button = null;
  path = null;
  isClosed = null;
  isFolder = null;
  isFile = null;
  padding = null;
  name = null;

  constructor(name, path, $parent, padding) {
    let $item = $($("#template-fb-item").html())
    let $title = $item.find(".fb-item-title")
    let $button = $item.find(".fb-item-btn")
    let $section = $item.find('section').first()
    let $icon = $item.find('i').first()
    
    $button.css('padding-left', padding + 'px')

    let isFile = name.includes('.');
    let isClosed = closedFolders[path];

    $title.html(name)
  
    // Close the folder if so
    if (isClosed == true) {
      $item.find('section').first().slideUp(1)
    }
  
    // Edit the icon
    if (isFile == true) {
      $icon.attr('class', noteIcon)
    } else { 
      $icon.attr('class', (isClosed ? folderClosedIcon : folderOpenIcon))
    }

    $item.data('filepath', path)
    $item.data('isFile', isFile)

    $item.appendTo($parent)

    this.$e = $item;
    this.$section = $section;
    this.$icon = $icon;
    this.$button = $button;
    this.path = path;
    this.isClosed = isClosed
    this.isFolder = !isFile;
    this.isFile = isFile;
    this.padding = padding;
    this.name = name;
  }

  GetParentPath() {
    return this.path.slice(0, this.path.lastIndexOf('\\'))
  }

  SetActive(v) {
    if (v) {
      this.$button.addClass('isActive')
    } else {
      this.$button.removeClass('isActive')
    }
  }

  ToggleFolderClosed() {
    if (this.isClosed) {
      this.$section.slideDown(150)
      this.isClosed = false
      this.$icon.attr('class', folderOpenIcon)
    } else {
      this.$section.slideUp(150)
      this.isClosed = true
      this.$icon.attr('class', folderClosedIcon)
    }
  }
}

//////////////////////////////////////////

function ItemLeftClick(event, item) {
  FBItems.SetActiveItem(item)
  return item.isFile ? Notepad.Open(item.path) : item.ToggleFolderClosed()
}

function ItemRightClick(event, item) {
  ContextMenu.show(event.pageX, event.pageY, [])
  if (item.path != fs.localFilesPath) {
    ContextMenu.add([
      ["Delete", () => {DeleteItem(item)}],
      ["Rename", () => {RenameItem(item)}],
    ]);
  }
  if (item.isFolder) {
    ContextMenu.add([
      ["New Note", () => {NewNote(item)}],
      ["New Folder", () => {NewFolder(item)}]
    ])
  }
}

function DeleteItem(item) {
  fs.DeleteFile(item.path, (err) => {
    if (err) {console.log("ERR:", err)}
    FileBrowser.Refresh()
  })
}

function RenameItem(item) {
  console.log("TODO: RENAME")
}

function NewNote(folderItem) {
  let itemPath = folderItem.path + "\\new note.txt" 
  fs.NewNote(itemPath, (err) => { 
    if (err) {console.log("ERR:", err)}
    folderItem.isClosed = false
    FileBrowser.Refresh()
  })
}

function NewFolder(folderItem) {
  let itemPath = folderItem.path + "\\new folder"
  fs.NewFolder(itemPath, (err) => {
    if (err) console.log("ERR: ", err)
    folderItem.isClosed = false
    FileBrowser.Refresh()
  })
}

//////////////////////////////////////////////////////

function ItemDrag(e1, item) {
  let isDragging = false;
  let $dragclone = null
  let offsetX = 10;
  let offsetY = 10;

  function movehandler(e2) {
      if (isDragging) {
          $dragclone.css({top: e2.pageY + offsetY, left: e2.pageX + offsetX})
      } else {
          const diffX = Math.abs(e1.pageX - e2.pageX)
          const diffY = Math.abs(e1.pageY - e2.pageY)
          if (diffX > 2 || diffY > 2) {
              isDragging = true;
              $dragclone = $($('#template-fb-item-dragging').html())
              $dragclone.css({top: e2.pageY + offsetY, left: e2.pageX + offsetX})
              $dragclone.text(item.name)
              $dragclone.css('position', 'absolute') 
              $dragclone.appendTo($('body'))
          }
      }
  }

  function uphandler(e2) {
      if (isDragging) {
          $dragclone.remove()
          let $t = $(document.elementFromPoint(e2.pageX, e2.pageY)).parents('.fb-item').first()

          if ($t.data('isFile') == false) {
            // DROPEED OVER A FOLDER
            fs.Move(item.path, $t.data('filepath'), (err) => {
              if (err) { console.error("ERR:", err); return; }
              Notepad.NotePathChanged(item.path, $t.data('filepath') + "\\" + item.name)
              FileBrowser.Refresh()
            })
          } else {
            // DSROPEPD OVER A FILE
          }
      }
      window.removeEventListener('mouseup', uphandler)
      window.removeEventListener('mousemove', movehandler)
  }

  window.addEventListener('mousemove', movehandler)
  window.addEventListener('mouseup', uphandler)
}

function BuildFolder(path) {
  let parentItem = FBItems.allItems[path]
  fs.ReadDirOrdered(path).forEach(fileName => {
    let filePath = `${path}\\${fileName}`
    let item = FBItems.NewItem(fileName, filePath, parentItem.$section, parentItem.padding + PADDING_INCREASE)
    if (item.isFolder) {
      BuildFolder(filePath)
    }
  })
}

function ClearFileBrowser() {
  FBItems.SaveOpened()
  $('#local-notes').html('')
}

function FillFileBrowser() {
    $filebrowserbody.html('') // Hard Clear
    FBItems.NewItem("LOCAL NOTES", fs.localFilesPath, $filebrowserbody, BASE_PADDING)
    BuildFolder(fs.localFilesPath);
}

FileBrowser.Refresh = function() {
    ClearFileBrowser()
    FillFileBrowser()
}

FileBrowser.SetActive = function(path) {
  let item = FBItems.FindFor(path)
  FBItems.SetActiveItem(item)
}

export {FileBrowser}