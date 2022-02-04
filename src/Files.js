
const {ipcRenderer} = require('electron')
const path = require('path')
const fs = require('fs');
const fse = require('fs-extra')

const userdataPath = ipcRenderer.sendSync('synchronous-message', 'ping')
const localFilesPath = path.join(userdataPath, "/LocalNotes")

function findLastIndex(str, x) {
    let index = -1;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == x) index = i
    }
    return index
}

function GetNextFolderPath(filePath, num = 1) {
    let fileName = path.basename(filePath)
    let newFileName = fileName + ` (${num})`
    let newFilePath = path.dirname(filePath) + "\\" + newFileName
    
    try {
        fs.accessSync(newFilePath, fs.constants.F_OK)
        return GetNextFolderPath(filePath, num + 1)
    } catch {
        return newFilePath
    }
}

function GetNextFilePath(filePath, num = 1) {
    let fileName = path.basename(filePath)
    let parts = fileName.split('.')
    let newFileName = parts[0] + ` (${num})` + "." + parts[1]
    let newFilePath = path.dirname(filePath) + "\\" + newFileName
    
    try {
        fs.accessSync(newFilePath, fs.constants.F_OK)
        return GetNextFilePath(filePath, num + 1)
    } catch {
        return newFilePath
    }
}

function TryCreateNote(filePath, func) {
    let fileName = path.basename(filePath)
    fs.access(filePath, fs.constants.F_OK, (err) => {
        // THE FILE DOES NOT EXIST, create it
        if (err) { 
            fs.writeFile(filePath, "Hello World", func)
        
        // THE FILE EXISTS, add to its number
        } else { 
            let parts = fileName.split('.')
            const {fileNum, x1, x2} = findFileNum(fileName)
            if (fileNum != -1) {
                let nextNum = 1 + fileNum
                let newFileName = parts[0].slice(0, x1) + `(${nextNum})` + '.' + parts[1]
                let newFilePath = path.dirname(filePath) + "\\" + newFileName
                console.log(newFileName)
                TryCreateNote(newFilePath, func)  
            } else {
                parts[0] = parts[0] + " (1)"
                let newFileName = parts.join('.')
                let newFilePath = path.dirname(filePath) + "\\" + newFileName
                TryCreateNote(newFilePath, func)
            }
        }
    })
}

class Files {
    userdataPath = userdataPath;
    localFilesPath = localFilesPath;

    ReadDirOrdered = (path) => {
        var files = fs.readdirSync(path)
        var dirs = files.filter((e) => { return !e.includes('.') })
        var notes = files.filter((e) => { return e.includes('.') })
        return [].concat(dirs, notes)
    }

    DeleteFile = (filePath, func) => {
        if (!path.basename(filePath).includes('.')) {
            fs.rm(filePath, {recursive: true}, func)
        } else {
            fs.rm(filePath, func)
        }
    }

    NewNote = (filePath, func) => {
        fs.access(filePath, (err) => {
            if (err) {
                fs.writeFile(filePath, "Hello World", func)
            } else {
                let newNotePath = GetNextFilePath(filePath)
                fs.writeFile(newNotePath, "Hello World", func)
            }
        })
    }

    NewFolder = (folderPath, func) => {
        fs.mkdir(folderPath, (err) => {
            if (err) { // a folder already exists with this name
                let newFolderPath = GetNextFolderPath(folderPath)
                fs.mkdir(newFolderPath, (err) => {
                    console.log(err)
                })
            }
            func()
        })
    }

    Move = (src, destParent, func) => {
        let newPath = path.join(destParent, path.basename(src))
        console.log(newPath)
        fs.access(newPath, (err) => {
            if (err) {
                fse.move(src, newPath, (err) => {
                    if (err) {
                        console.error(err)
                    } else {
                        func()
                    }
                })
            } else {
                console.log('ERR: file already exists in that directory')
            }
        })
    }

    ReadFile = (filepath, func) => {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                console.error(err)
                return;
            } 
            func(data.toString('utf-8'))
        })
    }

    OverwriteFile = (filepath, text, onSuccess) => {
        fs.writeFile(filepath, text, (err) => {
            if (err) {
                console.error(err)
                return
            }
            onSuccess()
        })
    }
}

const manager = new Files();
module.exports = manager;