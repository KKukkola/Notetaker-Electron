
let CalendarPage = new Object()

let MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "November", "December",
]
let DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

let $monthText = $("#calendar-month-title")

let daysList = []

class CalendarDay {
    $e = null;
    day = null;
    
    constructor(day, invalidDay) {
        let $day = $($("#template-calendar-day").html())
        $day.find('.c-num').html(day+1)
        $day.appendTo($('#calendar'))

        if (invalidDay) {
            $day.find('.c-num').html('')
            $day.addClass('non-day')
        }

        daysList.push(this)
        
        this.$e = $day;
        this.day = day;
    }

}

$('#to-calendarpage').click(function(event) {
    CalendarPage.Show()
})

CalendarPage.Show = function() {
    $('#calendar').html('')
    $("#calendarpage").addClass('isActive')

    // Set the Month to the current month
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    console.log(DAYS[firstDay.getDay()], firstDay.getDate())
    console.log(DAYS[lastDay.getDay()], lastDay.getDate())

    $monthText.text(MONTHS[month])

    // Fill the calendar with its 42 divs
    let cDay = 0 - firstDay.getDay()
    for (let i = 0; i < 42; i++) {
        let day = new CalendarDay(cDay, cDay < 0 || cDay >= lastDay.getDate())
        cDay += 1;
    }

}

export {CalendarPage}