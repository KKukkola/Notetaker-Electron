
let CalendarPage = new Object()

let MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "November", "December",
]

let $monthText = $("calendar-month-title")

$('#to-calendarpage').click(function(event) {
    CalendarPage.Show()
})

CalendarPage.Show = function() {
    $("#calendarpage").addClass('isActive')

    // Set the Month to the current month
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    $monthText.Text = MONTHS[month]


}

export {CalendarPage}