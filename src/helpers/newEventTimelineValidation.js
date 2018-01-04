// TAKES IN 1 EVENT, GIVES END TIME DEPENDING ON MODEL.
function findEndTime (event) {
  var endTime = null
  if (event.type === 'Activity' || event.type === 'Food') {
    endTime = event[event.type].endTime
  } else {
    endTime = event.time
  }
  return endTime
}

function checkIfStartingRow (event) {
  return (typeof (event.start) === 'boolean' && event.start && event.type !== 'Lodging')
}

function checkIfEndingRow (event) {
  return (typeof (event.start) === 'boolean' && !event.start && event.type !== 'Lodging')
}

// TAKING IN AN EVENTS ARR, MODEL NAME, AND NEWEVENT OBJ
function newEventTimelineValidation (eventsArr, model, newEvent) {
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
        var isStartingRow = checkIfStartingRow(lastRow)
        if (isStartingRow) {
          isValid = false
        } else {
          // check if start time is after end time of last row <last end time, start time>
          var lastTiming = findEndTime(lastRow)
          var didStartTimeOverlap = (newEvent.startTime < lastTiming)
          if (didStartTimeOverlap) {
            console.log('start time is before end time of previous row')
            isValid = false
          }
        }
      } else {
        console.log('displaced row exists')
        // if displacedRow exists, check if it is an ending row of type start:false (not lodging)
        var isEndingRow = checkIfEndingRow(displacedRow)

        if (isEndingRow) {
          console.log('displaced ending row')
          isValid = false
        } else {
          console.log('not ending row')
          // if displacedRow exists but not an ending row, check end time is also before displaced time, else overlap <start, end><ending row>
          var didEndTimeOverlap = (displacedRow.time < newEvent.endTime)
          if (didEndTimeOverlap) {
            isValid = false
          }
          // check row before displaced row. newEvent start time must be after previous ending
          var displacedIndex = dayEvents.indexOf(displacedRow)
          var previousRow = dayEvents[displacedIndex - 1]
          lastTiming = findEndTime(previousRow)
          if (newEvent.startTime < lastTiming) {
            console.log('start time is before previous event ended')
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
      isStartingRow = checkIfStartingRow(lastRow)
      if (isStartingRow) {
        isValid = false
      } else {
        // if last row is not a starting row (valid), startTime must also be greater than end time of last row
        lastTiming = findEndTime(lastRow)
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
  if (model === 'Lodging') {
    var types = ['start', 'end'] // start and end of new lodging
    types.forEach(type => {
      dayEvents = eventsArr.filter(e => {
        return e.day === newEvent[`${type}Day`]
      })
      var displacedRow = dayEvents.find(e => {
        return (e.time > newEvent.startTime)
      })
      if (!displacedRow) {
        // last event must not be of type starting
        var lastRow = dayEvents[dayEvents.length - 1]
        var isStartingRow = checkIfStartingRow(lastRow)
        if (isStartingRow) {
          isValid = false
        } else {
          // check if start time is after end time of last row <last end time, start time>
          var lastTiming = findEndTime(lastRow)
          var didStartTimeOverlap = (newEvent.startTime < lastTiming)
          if (didStartTimeOverlap) {
            console.log('start time is before end time of previous row')
            isValid = false
          }
        }
      }
    })
  }
  return isValid
}

export default newEventTimelineValidation
