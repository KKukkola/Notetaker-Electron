
let Timeline = new Object()

Timeline.Refresh = () => {
    console.log("TODO: Timeline.Refresh")
    db.EachEvent(function(row) {
        console.log(`${row.id} ${row.title} ${row.starthour} ${row.endhour} ${row.pmam}`)
    })
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

    // TODO: add PM or AM to the event
    let eName = newEventModal.find('#tmei-title').val()
    let eStart = newEventModal.find('#tmei-start').val()
    let eEnd = newEventModal.find('#tmei-end').val()
    console.log("TODO: Timeilne event submite db.AddEvent")
    // db.AddEvent(eName, eStart, eEnd, "PM", () => {
    //     console.log("OnFinish()")
    // })
})

export {Timeline}