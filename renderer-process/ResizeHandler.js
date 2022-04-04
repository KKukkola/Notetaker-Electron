
let ResizeHandler = new Object()

let $fbResize = $('#fb-resize')
let $tlResize = $('#tl-resize')

// Current Mouse Position
let x = 0;
let y = 0;

let bottomSize = 0;

let resizeDirection = "horizontal"

function MouseMoveHandler(e) {
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    switch (resizeDirection) {
        case "horizontal":
            const newLeftSize = x + dx;
            document.documentElement.style.setProperty('--fb-width', newLeftSize + 'px')
            break;
        case "vertical":
            const newHeightSize = bottomSize + -dy; 
            console.log(bottomSize, dy, newHeightSize)
            document.documentElement.style.setProperty('--tl-height', newHeightSize + 'px')
            break;
    }

    const cursor = resizeDirection === 'horizontal' ? 'ew-resize' : 'ns-resize';
    document.body.style.cursor = cursor;
}

function MouseUpHandler(e) {
    document.body.style.removeProperty('cursor')
    document.removeEventListener('mousemove', MouseMoveHandler)
    document.removeEventListener('mouseup', MouseUpHandler)
}

function MouseDownHandler(e) {
    x = e.clientX;
    y = e.clientY;
    bottomSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tl-height')) //document.documentElement.style.getPropertyValue('--tl-height');
    console.log(bottomSize)
    resizeDirection = e.target.getAttribute('data-dir') || 'horizontal'
    document.addEventListener('mousemove', MouseMoveHandler)
    document.addEventListener('mouseup', MouseUpHandler)
}

$fbResize[0].addEventListener('mousedown', MouseDownHandler)
$tlResize[0].addEventListener('mousedown', MouseDownHandler)

export {ResizeHandler} 