
import {Timeline} from "./Timeline.js"

let CalendarPage = new Object()

let MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "November", "December",
]
let DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

let $calendarpage = $("#calendarpage")
let $monthText = $("#calendar-month-title")
let $overviewTimelineDiv = $calendarpage.find(".day-overview-timeline")

let DATE_OBJ = new Date()

let daysList = []

let DayOverview = {

    Set: function(dayObj) {
        console.log("Set Overview:", dayObj.day, dayObj.dayText)
        $calendarpage.find(".day-title").first().html(dayObj.day + " " + dayObj.dayText)
        $overviewTimelineDiv.html('')
        Timeline.FillContainerWithDay($overviewTimelineDiv, dayObj)
    }

}

class CalendarDay {
    $e = null;
    day = null;
    month = null;
    year = null;
    invalid = false;
    dayText = null;
    
    constructor(day, month, year, invalidDay) {
        let $day = $($("#template-calendar-day").html())
        $day.find('.c-num').html(day)
        $day.appendTo($('#calendar'))
        
        if (invalidDay) {
            $day.find('.c-num').html('')
            $day.addClass('non-day')
        }

        $day.click((event) => { CalendarDayClicked(this) })

        daysList.push(this)
        
        this.$e = $day;
        this.day = day;
        this.month = month;
        this.year = year;
        this.invalid = invalidDay;
        this.dayText = DAYS[new Date(DATE_OBJ.getFullYear(), DATE_OBJ.getMonth(), day).getDay()];
    }
}

function CalendarDayClicked(dayObj) {
    if (dayObj.invalid === true) return;
    DayOverview.Set(dayObj)
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
    let cDay = 0 - firstDay.getDay() // will be 0-indexxed
    for (let i = 0; i < 42; i++) {
        let day = new CalendarDay(cDay+1, date.getMonth()+1, date.getFullYear(), 
            cDay < 0 || cDay >= lastDay.getDate())
        cDay += 1;
    }
}

export {CalendarPage}