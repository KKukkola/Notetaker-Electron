
let Timeline = new Object()

let timelineMin = 0
let timelineMax = 24

const SEC_PER_HOUR = 3600
const SEC_PER_MIN = 60

let newEventBtn = $('#timeline-new-event-btn')
let newEventModal = $('#timeline-new-event-modal')
let newEventModalClose = newEventModal.find('span').first()
let newEventSubmitBtn = $('#tme-submit-btn')

let $timelineBody = $('#timeline-body')

let addedEvents = []

function EventClicked($div) {
    console.log("An Event Was Clicked!")
}

function DrawTimelineLines() {
    let timelineHours = timelineMax - timelineMin
    for (let i = 0; i < timelineMax - timelineMin; i++) {
        let $div = $("<div></div>")
        $div.addClass('timeline-line-div')
        //$div.html(i)
        $div.css({
            left: `${(i/timelineHours)*100}%`
        })
        $div.appendTo($timelineBody)
    }
}

function NewEventElement(eventData) {
    let $div = $("<div></div>")
    $div.data('event-id', eventData.id)
    
    let numHours = timelineMax - timelineMin;
    let currentSeconds = (eventData.starthour*SEC_PER_HOUR) + (eventData.startmin*SEC_PER_MIN)
    let lengthSeconds = (eventData.endhour*SEC_PER_HOUR) + (eventData.endmin*SEC_PER_MIN) - currentSeconds

    let maxSeconds = SEC_PER_HOUR*numHours
    let curSeconds = currentSeconds - (SEC_PER_HOUR*timelineMin)

    let leftPercent = curSeconds/maxSeconds * 100
    let widthPercent = lengthSeconds/maxSeconds * 100
    let rightPercent = leftPercent + widthPercent

    console.log(leftPercent, widthPercent, rightPercent)
    
    // get the row / top that this event goes into
    let top = 2;
    let rowNum = 0;
    addedEvents.forEach(e => {
        if (e.rowNum == rowNum) {
            if (leftPercent >= e.leftPercent && leftPercent <= e.rightPercent) {
                rowNum += 1;
                top += 10*rowNum + 2*rowNum;
            }
        }
    })

    // add it to the html
    $div.addClass('event-div')
    $div.css({
        width: `${widthPercent}%`,
        left: `${leftPercent}%`,
        top: `${top}px`
    })

    // log the element as a part of our data
    addedEvents.push({
        rowNum: rowNum,
        leftPercent: leftPercent,
        rightPercent: rightPercent,
    })

    // add the event to it
    $div.on('click', (event) => {
        EventClicked($div)
    })
    return $div
}

function AddEvent(eventData) {
    let $eventElement = NewEventElement(eventData)
    $eventElement.appendTo($timelineBody)
    return $eventElement
}

function HideNewEventModal() {
    newEventModal.css('display', 'none')
    newEventModal.find('#tmei-title').val('')
    newEventModal.find('#tmei-start').val('')
    newEventModal.find('#tmei-end').val('')
}

Timeline.Refresh = () => {
    $timelineBody.empty() // clear
    addedEvents = [] // clear

    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    DrawTimelineLines()
    db.EachEvent(function(dbRow) {
        AddEvent(dbRow)
    }, function() {
        console.log("finished refreshing timeline")
    }, month, day)
}

newEventBtn.click(function(ev) {
    newEventModal.css('display', 'block') 
    console.log('asdf')
})

newEventSubmitBtn.click(function(ev) {
    ev.preventDefault()
    
    console.log("EventSubmitButton Clicked")

    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let eventData = {
        eventName: newEventModal.find('#tmei-title').val(),
        startHour: parseInt(newEventModal.find('#tmei-start').val()),
        startMin: 0,
        endHour: parseInt(newEventModal.find('#tmei-end').val()),
        endMin: 0,
        month: month,
        day: day,
    } 

    db.AddEvent(eventData, () => {
        console.log("OnFinish()")
        HideNewEventModal()
        Timeline.Refresh()
    })
})

/************************ */
// Timeline New Event Modal

newEventModalClose.click(function(ev) {
    newEventModal.css('display', 'none')
})

newEventModal.click(function(ev) {
    if ($(ev.target).attr('id') == "timeline-new-event-modal") {
        newEventModal.css('display', 'none')
    }
})

/************************ */
// Timeline Min / Max

let starthourDiv = $('#timeline-starthour-input')
let endhourDiv = $('#timeline-endhour-input')

starthourDiv.text(timelineMin)
endhourDiv.text(timelineMax)

$('.timeline-hour-input').on('keydown', function(event) {
    if (event.keyCode === 13) {
        event.target.blur()
    } else if (event.keyCode === 8) {
        // do nothing
    } else if (event.keyCode > 57 || event.keyCode < 48) {
        event.preventDefault()
    }
})

starthourDiv.on('focusout', function(event) {
    let num = parseInt(starthourDiv.text())
    if (num == null || num % 1 !== 0) {
        starthourDiv.text(timelineMin)
    } else if (num >= timelineMax) {
        starthourDiv.text(timelineMin)
    } else if (num < 0 || num >= timelineMax) {
        starthourDiv.text(timelineMin)
    } else {
        // good min
        timelineMin = num;
        starthourDiv.text(num)
        Timeline.Refresh()
    }
})

endhourDiv.on('focusout', function(event) {
    let num = parseInt(endhourDiv.text())
    if (num == null || num % 1 !== 0) {
        endhourDiv.text(timelineMax)
    } else if (num >= timelineMax) {
        endhourDiv.text(timelineMax)
    } else if (num > 24 || num <= timelineMin) {
        endhourDiv.text(timelineMax)
    } else {
        // good max
        timelineMax = num;
        endhourDiv.text(num)
        Timeline.Refresh();
    }
})

export {Timeline}