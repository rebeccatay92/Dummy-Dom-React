// TAKING IN AN EVENTS ARR, MODEL NAME, AND NEWEVENT OBJ

function newEventTimelineValidation (eventsArr, model, newEvent) {
  // console.log('eventsArr', eventsArr)
  var isValid = true

  if (model === 'Activity' || model === 'Food') {
    var isSameDay = (newEvent.startDay === newEvent.endDay)
    if (isSameDay) {
      console.log('is same day')
      var dayEvents = eventsArr.filter(e => {
        return e.day === newEvent.startDay
      })
      var displacedRow = dayEvents.find(e => {
        return (e.time > newEvent.startTime)
      })

      if (!displacedRow) {
        console.log('no displaced row')
        // if no displaced row (insert right at end), check last row in that day is not of type start:true
        var lastRow = dayEvents[dayEvents.length - 1]
        // var displacedIndex = dayEvents.indexOf(displacedRow)
        // var previousRow = dayEvents[displacedIndex - 1]
        var isStartingRow = (typeof (lastRow.start) === 'boolean' && lastRow.start && lastRow.type !== 'Lodging')
        if (isStartingRow) {
          isValid = false
        } else {
          // check if start time is after end time of last row
          var lastTiming = null
          if (lastRow.type === 'Activity' || lastRow.type === 'Food') {
            lastTiming = lastRow[lastRow.type].endTime
          } else {
            lastTiming = lastRow.time
          }
          var didStartTimeOverlap = (lastTiming > newEvent.startTime)
          if (didStartTimeOverlap) {
            console.log('start time is before end time of previous row')
            isValid = false
          }
        }
      } else {
        console.log('displaced row exists')
        // if displacedRow exists, check if it is an ending row of type start:false (not lodging)
        var isEndingRow = (typeof (displacedRow.start) === 'boolean' && !displacedRow.start && displacedRow.type !== 'Lodging')

        if (isEndingRow) {
          isValid = false
        } else {
          console.log('not ending row')
          // if displacedRow exists but not an ending row, check end time is also before displaced time, else overlap
          console.log('endTime', newEvent.endTime, 'displaced time', displacedRow.time)
          var didEndTimeOverlap = (displacedRow.time < newEvent.endTime)
          if (didEndTimeOverlap) {
            isValid = false
          }
          // check row before displaced row. newEvent start time must be after previous ending
          var displacedIndex = dayEvents.indexOf(displacedRow)
          var previousRow = dayEvents[displacedIndex - 1]
          lastTiming = null
          if (previousRow.type === 'Activity' || previousRow.type === 'Food') {
            lastTiming = previousRow[previousRow.type].endTime
          } else {
            lastTiming = previousRow.time
          }
          if (newEvent.startTime < lastTiming) {
            isValid = false
          }
        }
      }
    } else { // if different start and end day
      var startDayEvents = eventsArr.filter(e => {
        return e.day === newEvent.startDay
      })
      // last row of day 1 must not be a startingRow
      lastRow = startDayEvents[startDayEvents.length - 1]
      isStartingRow = (typeof (lastRow.start) === 'boolean' && lastRow.start && lastRow.type !== 'Lodging')
      if (isStartingRow) {
        isValid = false
      } else {
        // if last row is not a starting row (valid), startTime must also be greater than end time of last row
        // time in events arr is only startTime for activity/food, but refers to either start or end time for other 2 row models
        lastTiming = null
        if (lastRow.type === 'Activity' || lastRow.type === 'Food') {
          lastTiming = lastRow[lastRow.type].endTime
        } else {
          lastTiming = lastRow.time
        }
        if (newEvent.startTime < lastTiming) {
          isValid = false
        }
      }
      // end time must be earlier than first event start time on next day
      var endDayEvents = eventsArr.filter(e => {
        return e.day === newEvent.endDay
      })
      var firstRowOfEndDay = endDayEvents[0]
      if (newEvent.endTime > firstRowOfEndDay.time) {
        isValid = false
      }
    }
  } // close activity/food
  return isValid
}

export default newEventTimelineValidation
