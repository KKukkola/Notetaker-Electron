// 1-27-2022

import {ContextMenu} from "./ContextMenu.js"
import { Notepad } from "./Notepad.js";

let FileBrowser = new Object();
let closedFolders = new Object();

const folderOpenIcon = "fas fa-folder-open"
const folderClosedIcon = "fas fa-folder"
const noteIcon = "far fa-file-alt"

function SaveOpened() {
  closedFolders = new Object();
  $("#filebrowser").find('.fb-item').each((index, element) => {
    let $e = $(element)
    if ($e.data('isFile') == "false") {
      closedFolders[$e.data('filepath')] = $e.data('isUp')
    }
  })
}

function ItemLeftClick(event, $item) {
  if ($item.data('isFile') == "true") {
    Notepad.Open($item.data('filepath'))
  } else {
    if ($item.data('isUp') == true) {
      $item.find('section').first().slideDown(150)
      $item.data('isUp', false)
      $item.find('i').first().attr('class', folderOpenIcon)
    } else {
      $item.find('section').first().slideUp(150)
      $item.data('isUp', true)
      $item.find('i').first().attr('class', folderClosedIcon)
    }
  }
}

function ItemRightClick(event, $item) {
  
  ContextMenu.show(event.pageX, event.pageY, [])

  if ($item.data('filepath') != fs.localFilesPath) {
    ContextMenu.add([
      ["Delete", () => {
        let filePath = $item.data('filepath')
        fs.DeleteFile(filePath, (err) => {
          if (err) {console.log("ERR:", err)}
          ClearFileBrowser()
          FillFileBrowser()
        })
      }],
      ["Rename", () => {
        let filePth = $item.data('filepath')
        console.log("TODO: RENAME")
      }]
    ]);
  }
  
  if ($item.data('isFile') == "false") {
    ContextMenu.add([
      ["New Note", () => {
        let notePath = $item.data('filepath') + "\\new note.txt" 
        fs.NewNote(notePath, (err) => { 
          if (err) {console.log("ERR:", err)}
          $item.data('isUp', false)
          ClearFileBrowser()
          FillFileBrowser()
        })
      }],
      ["New Folder", () => {
        let folderPath = $item.data('filepath') + "\\new folder"
        fs.NewFolder(folderPath, (err) => {
          if (err) console.log("ERR: ", err)
          $item.data('isUp', false)
          ClearFileBrowser()
          FillFileBrowser()
        })
      }]
    ])
  }
}

function CreateItem(name, path, $parent, depth) {
  let $clone = $($("#template-fb-item").html())
  let $title = $clone.find(".fb-item-title")
  let $button = $clone.find(".fb-item-btn")
  let $icon = $clone.find('i').first()

  // edit the clone
  $title.html(name)
  let nextPadding = parseInt( 25 + (depth * 10))
  $button.css("padding-left", nextPadding.toString() + "px")
  $clone.data('filepath', `${path}\\${name}`)
  $clone.data('isFile', ($title.html().includes('.')).toString() )
  $clone.data('isUp', false)

  // add click events to the clone
  $button.mousedown((event) => {
    switch(event.which) {
      case 1: ItemLeftClick(event, $clone); break;
      case 3: ItemRightClick(event, $clone); break;
    }
  })

  // add click and drag events to the clone
  $button.mousedown((e1) => {
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
                    $dragclone.text(name)
                    $dragclone.css('position', 'absolute') 
                    $dragclone.appendTo($('body'))
                }
            }
        }
      
        function uphandler(e2) {
            if (isDragging) {
                $dragclone.remove()
                let $t = $(document.elementFromPoint(e2.pageX, e2.pageY)).parents('.fb-item').first()
                if ($t.data('isFile') === "false") {
                  // DROPEED OVER A FOLDER
                  fs.Move($clone.data('filepath'), $t.data('filepath'), (err) => {
                      if (err) {
                          console.error(err)
                      } else {
                          ClearFileBrowser()
                          FillFileBrowser()
                      }
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
  })
//   $button.on('dragstart', function (event) {
//       console.log("drag start")
//   })
//   $title.on('dragover', function(event) {
//       event.preventDefault();
//       console.log('dragover')
//   })
//   $button.on('drop', function(event) {
//       console.log("drop")
//   })
  
  // edit the content
  let itemIsClosed = closedFolders[$clone.data('filepath')]
  let itemIsFile = $clone.data('isFile')

  // make folder open or closed
  if (itemIsClosed == true) {
    $clone.find('section').first().slideUp(1)
    $clone.data('isUp', true)
  }

  // edit the icon
  if (itemIsFile == "false") { // is a folder
    if (itemIsClosed == true) {
      $icon.attr('class', folderClosedIcon)
    } else {
      $icon.attr('class', folderOpenIcon)
    }
  } else { // is a file
    $clone.find('i').first().attr('class', noteIcon)
  }
  $icon.css('color', '#939393')

  $clone.appendTo($parent)
  return $clone
}

function BuildDirectory(dirPath, $parent, depth) {
  fs.ReadDirOrdered(dirPath).forEach(fileName => {
    let $item = CreateItem(fileName, dirPath, $parent, depth)
    if ($item.data('isFile') == "false") {
      let nextPath = dirPath + "\\" + fileName
      let nextParent = $item.find("section")
      BuildDirectory(nextPath, nextParent, depth + 1)
    }
  })
}

function ClearFileBrowser() {
  SaveOpened()
  $('#local-notes').html('')
}

function FillFileBrowser() {
    $('#filebrowser').html('')
    let $localnotes = CreateItem("LOCAL NOTES", fs.localFilesPath, $('#filebrowser'))
    $localnotes.data('filepath', fs.localFilesPath)
    BuildDirectory(fs.localFilesPath, $localnotes.find('section'), 0)
}

FileBrowser.Refresh = function() {
    ClearFileBrowser()
    FillFileBrowser()
}

export {FileBrowser}