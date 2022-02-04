var $contextMenu = $($('#template-context-menu').html())
$contextMenu.appendTo('html')
var clickEventListening = false

function ClickOutOfMenu(event) {
    var $element = $(document.elementFromPoint(event.x, event.y))
    console.log()
    if ($element.parents('.custom-context-menu').length === 0) {
        ContextMenu.clear()
    }
}

function ContextMenu() { }

ContextMenu.show = function(x, y, context) {
    $contextMenu.css('top', `${y+2}px`)
    $contextMenu.css('left', `${x+2}px`)
    
    ContextMenu.fill(context)

    $contextMenu.css('display', 'block')
    return $contextMenu 
}

ContextMenu.fill = function(context) {
    ContextMenu.clear()
    context.forEach(element => {
        let $btn = $('<div></div>', 
        {
            text: element[0],
            click: () => {element[1](); ContextMenu.clear()},
            class: "context-btn",
        })
        $contextMenu.append($btn)
    });
    if (!clickEventListening) {
        clickEventListening = true;
        document.addEventListener('click', ClickOutOfMenu)
    }
}

ContextMenu.add = function(context) {
    context.forEach(element => {
        let $btn = $('<div></div>', 
        {
            text: element[0],
            click: () => {element[1](); ContextMenu.clear()},
            class: "context-btn",
        })
        $contextMenu.append($btn)
    })
}

ContextMenu.clear = function() {
    if (clickEventListening) {
        document.removeEventListener('click', ClickOutOfMenu)
        clickEventListening = false;
    }
    $contextMenu.html('')
}

export {ContextMenu}