
let Timeline = new Object()

let timelineMin = 0
let timelineMax = 24

const SEC_PER_HOUR = 3600
const SEC_PER_MIN = 60

let newEventBtn = $('#timeline-new-event-btn')
let newEventModal = $('#timeline-new-event-modal')
let newEventModalClose = newEventModal.find('span').first()
let newEventSubmitBtn = $('#tme-submit-btn')

let starthourDiv = $('#timeline-starthour-input')
let endhourDiv = $('#timeline-endhour-input')

let $timelineBody = $('#timeline-body')
let $timelineChange = $('#timeline-c-div')

let $cSelectedEvent = null

let addedEvents = []

function EventClicked($eventDiv) {
    // Cancel the current selection
    if ($cSelectedEvent == $eventDiv) {
        ToggleTimelineChange(false)
        return
    }
    
    // Select the Event
    console.log('Clicked: ', $eventDiv)
    $cSelectedEvent = $eventDiv
    FillChangeData($eventDiv)
    ToggleTimelineChange(true)
}

function ToggleTimelineChange(val) {
    if (val === true) {
        $timelineChange.css('display', 'block')
    } else {
        $timelineChange.css('display', 'none')
        $cSelectedEvent = null;
    }
}

function FillChangeData($eventDiv) {
    $('#tc-title').text($eventDiv.data('title'))
    $('#tc-starthour').text($eventDiv.data('starthour'))
    $('#tc-startmin').text($eventDiv.data('startmin'))
    $('#tc-endhour').text($eventDiv.data('endhour'))
    $('#tc-endmin').text($eventDiv.data('endmin'))
    $('#tc-month').text($eventDiv.data('month'))
    $('#tc-day').text($eventDiv.data('day'))
    $('#tc-year').text($eventDiv.data('year'))
}

function GetTimelineChangeData() {
    
    // TODO: change date to the internal timeline date

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return {
        id: parseInt($cSelectedEvent.data('id')),
        title: $('#tc-title').text(),
        starthour: parseInt($('#tc-starthour').text()),
        startmin: parseInt($('#tc-startmin').text()),
        endhour: parseInt($('#tc-endhour').text()),
        endmin: parseInt($('#tc-endmin').text()),
        month: month,
        day: day,
        year: year,
    }
}

function GetTimelineNewData() {
    
    // TODO: change date to the internal timeline date

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return {
        id: 0,
        title: $('#tn-title').val(),
        starthour: parseInt($('#tn-starthour').val()),
        startmin: parseInt($('#tn-startmin').val()),
        endhour: parseInt($('#tn-endhour').val()),
        endmin: parseInt($('#tn-endmin').val()),
        month: month,
        day: day,
        year: year,
    }
}

function DrawTimelineLines() {
    let timelineHours = timelineMax - timelineMin
    for (let i = 0; i < timelineMax - timelineMin; i++) {
        let $div = $("<div></div>")
        $div.addClass('timeline-line-div')
        $div.css({
            left: `${(i/timelineHours)*100}%`
        })
        $div.appendTo($timelineBody)
    }
}

function NewEventElement(eventData, calendarObj) {
    let $div = $("<div></div>")
    $div.data('id', eventData.id)
    $div.data('title', eventData.title)
    $div.data('starthour', eventData.starthour)
    $div.data('startmin', eventData.startmin)
    $div.data('endhour', eventData.endhour)
    $div.data('endmin', eventData.endmin)
    $div.data('month', eventData.month)
    $div.data('day', eventData.day)
    $div.data('year', eventData.year)
    
    let numHours = timelineMax - timelineMin;
    if (calendarObj != null) {
        numHours = calendarObj.Max - calendarObj.Min
    }
    
    let currentSeconds = (eventData.starthour*SEC_PER_HOUR) + (eventData.startmin*SEC_PER_MIN)
    let lengthSeconds = (eventData.endhour*SEC_PER_HOUR) + (eventData.endmin*SEC_PER_MIN) - currentSeconds

    let maxSeconds = SEC_PER_HOUR*numHours
    let curSeconds = currentSeconds - (SEC_PER_HOUR*timelineMin)

    let leftPercent = curSeconds/maxSeconds * 100
    let widthPercent = lengthSeconds/maxSeconds * 100
    let rightPercent = leftPercent + widthPercent
    
    let top = 2;
    let rowNum = 0;
    if (calendarObj) {
        calendarObj.addedEvents.forEach(e => {
            if (e.rowNum == rowNum) {
                if (leftPercent >= e.leftPercent && leftPercent < e.rightPercent) {
                    rowNum += 1;
                    top = 10*rowNum + 2 + 2*rowNum;
                }
            }
        })
        calendarObj.addedEvents.push({
            rowNum: rowNum,
            leftPercent: leftPercent,
            rightPercent: rightPercent,
        })
    } else {
        addedEvents.forEach(e => {
            if (e.rowNum == rowNum) {
                if (leftPercent >= e.leftPercent && leftPercent < e.rightPercent) {
                    rowNum += 1;
                    top = 10*rowNum + 2 + 2*rowNum;
                }
            }
        })
        addedEvents.push({
            rowNum: rowNum,
            leftPercent: leftPercent,
            rightPercent: rightPercent,
        })
        $div.on('click', (event) => {
            EventClicked($div)
        })
    }
    
    // add our html to it
    $div.addClass('event-div')
    $div.css({
        width: `${widthPercent}%`,
        left: `${leftPercent}%`,
        top: `${top}px`
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
    $('#tn-title').val('')
    $('#tn-starthour').val('')
    $('#tn-startmin').val('')
    $('#tn-endhour').val('')
    $('#tn-endmin').val('')
    $('#tn-month').val('')
    $('#tn-day').val('')
    $('#tn-year').val('')
}

Timeline.Refresh = () => {
    $timelineBody.empty() // clear
    addedEvents = [] // clear

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    DrawTimelineLines()
    db.EachEvent(function(dbRow) {
        AddEvent(dbRow)
    }, function() {
        console.log("Timeline draw finished: ", month, day, year)
    }, month, day, year)
}

newEventBtn.click(function(ev) {
    newEventModal.css('display', 'block') 
})

/************************ */
// Timeline New Event Modal

newEventSubmitBtn.click(function(ev) {
    ev.preventDefault()

    let eventData = GetTimelineNewData()

    console.log(eventData)

    db.AddEvent(eventData, () => {
        HideNewEventModal()
        Timeline.Refresh()
    })
})

newEventModalClose.click(function(ev) {
    HideNewEventModal()
})

newEventModal.click(function(ev) {
    if ($(ev.target).attr('id') == "timeline-new-event-modal") {
        HideNewEventModal()
    }
})

/************************ */
// Timeline Min / Max

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
        if (num == timelineMin) { return; }
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
    } else if (num <= timelineMin) {
        endhourDiv.text(timelineMax)
    } else if (num > 24 || num <= timelineMin) {
        endhourDiv.text(timelineMax)
    } else {
        if (num == timelineMax) { return; }
        // good max
        timelineMax = num;
        endhourDiv.text(num)
        Timeline.Refresh();
    }
})


/************************ */
// Timeline change remove/submit/cancel 

let $tcRemove = $('#tc-remove') 
let $tcSubmit = $('#tc-submit') 
let $tcCancel = $('#tc-cancel')

$tcRemove.on('click', function(event) {
    let eventData = GetTimelineChangeData();
    db.RemoveEvent(eventData, () => {
        ToggleTimelineChange(false)
        Timeline.Refresh()
    })
})

$tcSubmit.on('click', function(event) {
    let eventData = GetTimelineChangeData();
    db.ChangeEvent(eventData, () => {
        ToggleTimelineChange(false)
        Timeline.Refresh()
    })
})

$tcCancel.on('click', function(event) {
    ToggleTimelineChange(false)
})

//////////////////

Timeline.FillContainerWithDay = function($container, dayObj) {
    let calendarObj = {
        Max: 24,
        Min: 0,
        addedEvents: [],
    }

    db.EachEvent(function(eventData) {
        let $eventElement = NewEventElement(eventData, calendarObj)
        $eventElement.removeClass("event-div")
        $eventElement.addClass("calendar-event-div")
        $eventElement.appendTo($container)
    }, function() {
        console.log("FillContainerWithDay() Completed")
    }, dayObj.month, dayObj.day, dayObj.year)
}

Timeline.FillCalendarWithEvents = function(daysList, month, year) {
    
    let calendarObj = {
        Max: 24, 
        Min: 0,
        addedEvents: [],
    }
    let cDay = 1;
    db.EachEventOfMonth(function(eventData) {
        let dayObj = daysList[eventData.day]
        if (dayObj.day !== cDay) {
            calendarObj.addedEvents = []
            cDay = dayObj.day
        }
        let $eventElement = NewEventElement(eventData, calendarObj)
        $eventElement.removeClass("event-div")
        $eventElement.addClass("calendar-event-div")
        $eventElement.appendTo(dayObj.$timeline)
    }, function() {
        console.log("FillCalendarWithEvents() Completed")
    }, month, year)
}


export {Timeline}