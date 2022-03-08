
import {Timeline} from "./Timeline.js"

let CalendarPage = new Object()
CalendarPage.Month = 1;
CalendarPage.Year = 2022;

let MONTHS = [
    "NONE", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]
let DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

let $calendarpage = $("#calendarpage")
let $monthText = $("#calendar-month-title")
let $overviewTimelineDiv = $calendarpage.find(".day-overview-timeline")
let $calendar = $('#calendar')

let DATE_OBJ = new Date()

let daysList = new Object()

let DayOverview = {

    Set: function(dayObj) {
        $calendarpage.find(".day-title").first().html(dayObj.day + " " + dayObj.dayText)
        $overviewTimelineDiv.html('')
        Timeline.FillContainerWithDay($overviewTimelineDiv, dayObj)
        console.log("DayOverview:Set() date: ", dayObj.month, dayObj.day, dayObj.year)
    }

}

class CalendarDay {
    $e = null;
    $timeline = null;
    day = null;
    month = null;
    year = null;
    invalid = false;
    dayText = null;
    
    constructor(day, month, year, invalidDay) {
        let $day = $($("#template-calendar-day").html())
        $day.data('dayNumber', day)
        $day.find('.c-num').html(day)
        $day.appendTo($('#calendar'))
        
        if (invalidDay == true) {
            $day.find('.c-num').html('')
            $day.addClass('non-day')
        }

        this.$e = $day;
        this.$timeline = $day.find('.c-timeline').first()
        this.day = day;
        this.month = month;
        this.year = year;
        this.invalid = invalidDay;
        this.dayText = DAYS[new Date(DATE_OBJ.getFullYear(), DATE_OBJ.getMonth(), day).getDay()];
    }
}

$calendar.click((event) => {
    let $target = $(event.target)
    let $day = $target.parents('.calendar-day')
    if ($day.length > 0) {
        let dayObj = daysList[$day.data('dayNumber')]
        CalendarDayClicked(dayObj)
    }
})

function CalendarDayClicked(dayObj) {
    if (dayObj.invalid === true) return;
    DayOverview.Set(dayObj)
}

$('#calendar-left-button').click(function(event) {
    let prevMonth = CalendarPage.Month - 1
    if (prevMonth <= 0) prevMonth = 12
    CalendarPage.SetMonthYearDay(
        prevMonth,
        CalendarPage.Year, 
        1)
})

$("#calendar-right-button").click(function(event) {
    let nextMonth = CalendarPage.Month + 1
    if (nextMonth >= 13) nextMonth = 1
    CalendarPage.SetMonthYearDay(
        nextMonth,
        CalendarPage.Year, 
        1)
})

$('#to-calendarpage').click(function(event) {
    CalendarPage.Show()
})

$('#calendar-home-button').click(function(event) {
    CalendarPage.Hide()
})

CalendarPage.ClearCalendar = function() {
    for (let dayNumber in daysList) {
        daysList[dayNumber].$e.remove()
    }
    daysList = new Object()
    $('#calendar').html('')
}

CalendarPage.SetMonthYearDay = function(month, year, day) {
    CalendarPage.ClearCalendar()
    CalendarPage.Month = month;
    CalendarPage.Year = year;
    
    var firstDay = new Date(year, month - 1, 1); // because of indexes / offsets
    var lastDay = new Date(year, month, 0);

    $monthText.text(MONTHS[month])

    // Fill the calendar with its 42 divs
    let cDay = 0 - firstDay.getDay() // 0-indexxed
    for (let i = 0; i < 42; i++) {
        
        // Create the Day Object
        let isInvalid = cDay < 0 || cDay >= lastDay.getDate()
        let dayObj = new CalendarDay(cDay+1, month, year, isInvalid)

        daysList[dayObj.day] = dayObj
        
        // Set to our current day
        if (dayObj.day == day)//date.getDate()) 
        {
            DayOverview.Set(dayObj)
        }
        
        cDay += 1;
    }

    Timeline.FillCalendarWithEvents(daysList, month, year)
}

CalendarPage.Hide = function() {
    $calendarpage.removeClass('isActive')
}

CalendarPage.Show = function() {
    CalendarPage.ClearCalendar()

    // Set the Month to the current month
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    CalendarPage.SetMonthYearDay(month, year, day)
    
    $("#calendarpage").addClass('isActive')
}

export {CalendarPage}