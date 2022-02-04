
let Timeline = new Object()

Timeline.Refresh = () => {
    console.log("TODO: Timeline Refresh")
}


let newEventBtn = $('#timeline-new-event-btn')
let newEventModal = $('#timeline-new-event-modal')
let newEventModalClose = newEventModal.find('span').first()
let newEventSubmitBtn = $('#tme-submit-btn')

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

newEventSubmitBtn.click(function(ev) {
    ev.preventDefault()
    console.log("SUBMIT")
})

export {Timeline}