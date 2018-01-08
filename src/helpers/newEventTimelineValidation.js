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

function createErrorRow (row, errorRows) {
  // CREATE ERROR ROW (IGNORING ANY FROM NEWEVENT ITSELF)
  // PUSH ERROR ROW INTO ARR TO PASS OUT TO PLANNER (EXCLUDES NEWEVENT SINCE ID NOT CREATED YET)
  var errObj = null
  if (row.type && row.modelId) {
    errObj = {type: row.type, modelId: row.modelId}
  }
  if (!errorRows.includes(errObj)) {
    errorRows.push(errObj)
  }
  return errorRows
}

// TAKING IN AN EVENTS ARR, MODEL NAME, AND NEWEVENT OBJ
function newEventTimelineValidation (eventsArr, model, newEvent) {
  var output = {
    isValid: true,
    errorRows: []
  }

  if (model === 'Activity' || model === 'Food') {
    var isSameDay = (newEvent.startDay === newEvent.endDay)
    if (isSameDay) {
      var dayEvents = eventsArr.filter(e => {
        return e.day === newEvent.startDay
      })
      if (dayEvents.length < 1) return output

      var displacedRow = dayEvents.find(e => {
        return (e.time >= newEvent.startTime)
      })
      if (!displacedRow) {
        // check last row in that day is not of type start:true
        var lastRow = dayEvents[dayEvents.length - 1]
        var isStartingRow = checkIfStartingRow(lastRow)
        if (isStartingRow) {
          output.isValid = false
          output.errorRows = createErrorRow(lastRow, output.errorRows)
        } else {
          // check if start time is after end time of last row <last end time, start time>
          var lastTiming = findEndTime(lastRow)
          var didStartTimeOverlap = (newEvent.startTime < lastTiming)
          if (didStartTimeOverlap) {
            console.log('start time is before end time of previous row')
            output.isValid = false
            output.errorRows = createErrorRow(lastRow, output.errorRows)
          }
        }
      } else {
        console.log('displaced row exists')
        var isEndingRow = checkIfEndingRow(displacedRow)
        // if endingRow, and time is equals, newevent goes after, so its ok
        if (isEndingRow && displacedRow.time !== newEvent.startTime) {
          console.log('displaced ending row')
          output.isValid = false
          output.errorRows = createErrorRow(displacedRow, output.errorRows)
        } else {
          console.log('not ending row')
          // if displacedRow exists but not an ending row, check end time is also before displaced time, else overlap <start, end><ending row>
          var didEndTimeOverlap = (displacedRow.time < newEvent.endTime)
          if (didEndTimeOverlap) {
            console.log('new event overruns into displaced row start')
            output.isValid = false
            output.errorRows = createErrorRow(displacedRow, output.errorRows)
          }
          // check row before displaced row. newEvent start time must be after previous ending
          var displacedIndex = dayEvents.indexOf(displacedRow)
          if (displacedIndex === 0) return output.isValid
          var previousRow = dayEvents[displacedIndex - 1]
          lastTiming = findEndTime(previousRow)
          if (newEvent.startTime < lastTiming) {
            console.log('start time is before previous event ended')
            output.isValid = false
            output.errorRows = createErrorRow(previousRow, output.errorRows)
          }
        }
      }
    } else {
      // if different start and end day
      var startDayEvents = eventsArr.filter(e => {
        return e.day === newEvent.startDay
      })
      if (startDayEvents.length === 0) return output
      // last row of day 1 must not be a startingRow

      lastRow = startDayEvents[startDayEvents.length - 1]
      isStartingRow = checkIfStartingRow(lastRow)
      if (isStartingRow) {
        output.isValid = false
        output.errorRows = createErrorRow(lastRow, output.errorRows)
      } else {
        // if last row is not a starting row (valid), startTime must also be greater than end time of last row
        lastTiming = findEndTime(lastRow)
        if (newEvent.startTime < lastTiming) {
          output.isValid = false
          output.errorRows = createErrorRow(lastRow, output.errorRows)
        }
      }
      // end time must be earlier than first event start time on next day
      var endDayEvents = eventsArr.filter(e => {
        return e.day === newEvent.endDay
      })
      if (endDayEvents.length === 0) return output
      var firstRowOfEndDay = endDayEvents[0]
      if (newEvent.endTime > firstRowOfEndDay.time) {
        output.isValid = false
        output.errorRows = createErrorRow(firstRowOfEndDay, output.errorRows)
      }
    }
  } // close activity/food
  if (model === 'Lodging') {
    var types = ['start', 'end'] // start and end of new lodging
    types.forEach(type => {
      console.log('type', type)
      dayEvents = eventsArr.filter(e => {
        return e.day === newEvent[`${type}Day`]
      })
      if (!dayEvents) return output
      if (dayEvents.length < 1) return output

      displacedRow = dayEvents.find(e => {
        return (e.time >= newEvent[`${type}Time`])
      })
      if (!displacedRow) {
        var lastRow = dayEvents[dayEvents.length - 1]
        var isStartingRow = checkIfStartingRow(lastRow)
        if (isStartingRow) {
          console.log('trying to insert after starting row')
          output.isValid = false
          output.errorRows = createErrorRow(lastRow, output.errorRows)
        } else {
          // check newEvent.start time is after end time of last row
          var lastTiming = findEndTime(lastRow)
          var didTimeOverlap = (newEvent[`${type}Time`] < lastTiming)
          if (didTimeOverlap) {
            output.isValid = false
            output.errorRows = createErrorRow(lastRow, output.errorRows)
          }
        }
      } else {
        // if displaced row exists
        var isEndingRow = checkIfEndingRow(displacedRow)
        if (isEndingRow && displacedRow.time !== newEvent[`${type}Time`]) {
          output.isValid = false
          output.errorRows = createErrorRow(displacedRow, output.errorRows)
        } else {
          // if displaced row is not ending row, check timing is after endtime of previous row
          var displacedIndex = dayEvents.indexOf(displacedRow)
          if (displacedIndex === 0) return output
          var previousRow = dayEvents[displacedIndex - 1]
          lastTiming = findEndTime(previousRow)
          didTimeOverlap = (newEvent[`${type}Time`] < lastTiming)
          if (didTimeOverlap) {
            console.log('new event time is before end time of row before displaced row')
            output.isValid = false
            output.errorRows = createErrorRow(previousRow, output.errorRows)
          }
        }
      }
    })
  }
  if (model === 'Transport') {
    // transport end row must follow start row, unless split day
    isSameDay = (newEvent.startDay === newEvent.endDay)
    if (isSameDay) {
      dayEvents = eventsArr.filter(e => {
        return e.day === newEvent.startDay
      })
      if (!dayEvents) return output
      if (dayEvents.length < 1) return output
      displacedRow = dayEvents.find(e => {
        return e.time >= newEvent.startTime
      })

      if (!displacedRow) {
        lastRow = dayEvents[dayEvents.length - 1]
        isStartingRow = checkIfStartingRow(lastRow)
        if (isStartingRow) {
          output.isValid = false
          output.errorRows = createErrorRow(lastRow, output.errorRows)
        } else {
          // starttime > lastrow end time
          lastTiming = findEndTime(lastRow)
          var didTimeOverlap = (newEvent.startTime < lastTiming)
          if (didTimeOverlap) {
            output.isValid = false
            output.errorRows = createErrorRow(lastRow, output.errorRows)
          }
        }
      } else {
        // displaced row exists, check not ending row and time is not equal (if equal, load seq shifts by 1, its ok)
        isEndingRow = checkIfEndingRow(displacedRow)
        if (isEndingRow && displacedRow.time !== newEvent.startTime) {
          output.isValid = false
          output.errorRows = createErrorRow(displacedRow, output.errorRows)
        } else {
          // displaced row time is >= startTime, >= endTime
          didEndTimeOverlap = (displacedRow.time < newEvent.endTime)
          if (didEndTimeOverlap) {
            output.isValid = false
            output.errorRows = createErrorRow(displacedRow, output.errorRows)
          }
          // startTime >= previousRow endTime
          displacedIndex = dayEvents.indexOf(displacedRow)
          if (displacedIndex === 0) return output
          previousRow = dayEvents[displacedIndex - 1]
          lastTiming = findEndTime(previousRow)
          if (newEvent.startTime < lastTiming) {
            console.log('start time is before previous event ended')
            output.isValid = false
            output.errorRows = createErrorRow(previousRow, output.errorRows)
          }
        }
      }
    } else {
      // last on day 1
      startDayEvents = eventsArr.filter(e => {
        return e.day === newEvent.startDay
      })
      if (startDayEvents.length === 0) return output
      lastRow = startDayEvents[startDayEvents.length - 1]
      isStartingRow = checkIfStartingRow(lastRow)
      if (isStartingRow) {
        output.isValid = false
        output.errorRows = createErrorRow(lastRow, output.errorRows)
      } else {
        lastTiming = findEndTime(lastRow)
        if (newEvent.startTime < lastTiming) {
          output.isValid = false
          output.errorRows = createErrorRow(lastRow, output.errorRows)
        }
      }
      // first on day 2
      endDayEvents = eventsArr.filter(e => {
        return e.day === newEvent.endDay
      })
      if (endDayEvents.length === 0) return output
      firstRowOfEndDay = endDayEvents[0]
      if (newEvent.endTime > firstRowOfEndDay.time) {
        output.isValid = false
        output.errorRows = createErrorRow(firstRowOfEndDay, output.errorRows)
      }
    }
  }
  if (model === 'Flight') {
    // assuming flight instances for each day are inserted as a group, error will occur from last flight instance for that day onward
    // loop through each day
    // displaced row depends on the first flight instance for that day
    // if first instance is ending row, anything before it is wrong.
    // if last instance is of type start, everything after is wrong,
    // if last instance is of type end, displacedRow is right after it.

    console.log('flight instance arr', newEvent)
    var flightInstanceRows = []
    var days = []
    newEvent.forEach(instance => {
      // 2 rows for start/end
      flightInstanceRows.push(
        {day: instance.startDay, time: instance.startTime},
        {day: instance.endDay, time: instance.endTime}
      )

      if (!days.includes(instance.startDay)) {
        days.push(instance.startDay)
      } else if (!days.includes(instance.endDay)) {
        days.push(instance.endDay)
      }
    })
  }
  // passes both the boolean and row of errors
  return output
}

export default newEventTimelineValidation
