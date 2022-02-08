
let Timeline = new Object()

let timelineScale = 24 // hours

let newEventBtn = $('#timeline-new-event-btn')
let newEventModal = $('#timeline-new-event-modal')
let newEventModalClose = newEventModal.find('span').first()
let newEventSubmitBtn = $('#tme-submit-btn')

let $timelineBody = $('#timeline-body')

function DrawTimelineLines() {
    for (let i = 0; i < 24; i++) {
        let $div = $("<div></div>")
        $div.addClass('timeline-line-div')
        $div.css({
            left: `${(i/24)*100}%`
        })
        $div.appendTo($timelineBody)
    }
}

function NewEventElement(eventData) {
    let $div = $("<div></div>")
    
    let leftPos = (((eventData.starthour*60) + eventData.startmin) / (timelineScale*60) ) * 100
    let minutes = (eventData.endhour - eventData.starthour) * 60
    minutes = minutes + (eventData.endmin - eventData.startmin)
    $div.addClass('event-div')
    $div.css({
        width: `${(minutes/(timelineScale*60))*100}%`,
        left: `${leftPos}%`,
    })

    return $div
}

function AddEvent(eventData) {
    console.log("TODO: AddEvent(), ", eventData)
    let $eventElement = NewEventElement(eventData)
    $eventElement.appendTo($timelineBody)
    return $eventElement
}

Timeline.Refresh = () => {
    $timelineBody.html() // clear

    DrawTimelineLines()
    db.EachEvent(function(dbRow) {
        AddEvent(dbRow)
    })
}

newEventBtn.click(function(ev) {
    newEventModal.css('display', 'block') 
    console.log('asdf')
})

newEventModalClose.click(function(ev) {
    newEventModal.css('display', 'none')
})

newEventModal.click(function(ev) {
    if ($(ev.target).attr('id') == "timeline-new-event-modal") {
        newEventModal.css('display', 'none')
    }
})

function HideNewEventModal() {
    newEventModal.css('display', 'none')
    newEventModal.find('#tmei-title').val('')
    newEventModal.find('#tmei-start').val('')
    newEventModal.find('#tmei-end').val('')
}

newEventSubmitBtn.click(function(ev) {
    ev.preventDefault()
    
    console.log("EventSubmitButton Clicked")

    let eventData = {
        eventName: newEventModal.find('#tmei-title').val(),
        startHour: parseInt(newEventModal.find('#tmei-start').val()),
        startMin: 0,
        endHour: parseInt(newEventModal.find('#tmei-end').val()),
        endMin: 0,
        month: 2,
        day: 8,
    } 

    db.AddEvent(eventData, () => {
        console.log("OnFinish()")
        HideNewEventModal()
        Timeline.Refresh()
    })
})

export {Timeline}