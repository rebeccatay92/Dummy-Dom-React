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
      flightInstanceRows.push(
        {day: instance.startDay, time: instance.startTime, start: true},
        {day: instance.endDay, time: instance.endTime, start: false}
      )

      if (!days.includes(instance.startDay)) {
        days.push(instance.startDay)
      } else if (!days.includes(instance.endDay)) {
        days.push(instance.endDay)
      }
    })
    days.forEach(day => {
      var dayEvents = newEvent.filter(e => {
        return e.day === day
      })
      var dayInstanceRows = flightInstanceRows.filter(e => {
        return e.day === day
      })
      var firstInstanceInDay = dayInstanceRows[0]
      var lastInstanceInDay = dayInstanceRows[dayInstanceRows.length - 1]

      // compare day events with incoming flight instances
      var displacedRow = dayEvents.filter(e => {
        return (e.time >= firstInstanceInDay.time)
      })

      if (!displacedRow) {
        // if first flight instance is an ending row, the entire day is invalid
        if (!firstInstanceInDay.start) {
          output.isValid = false
          // construct errorRows for all events in day
          for (var i = 0; i < dayEvents.length - 1; i++) {
            output.errorRows = createErrorRow(dayEvents[i], output.errorRows)
          }
        }

        // check last row in day is not of type starting
        var lastRow = dayEvents[dayEvents.length - 1]
        var isStartingRow = checkIfStartingRow(lastRow)
        if (isStartingRow) {
          output.isValid = false
          output.errorRows = createErrorRow(lastRow, output.errorRows)
        } else {
          // check flight instance time is after lastRow endTime
          var lastTiming = findEndTime(lastRow)
          var didTimeOverlap = (firstInstanceInDay.time < lastTiming)
          if (didTimeOverlap) {
            output.isValid = false
            output.errorRows = createErrorRow(lastRow, output.errorRows)
          }
        }
      } else {
        // displacedRow exists
        // if first flight is ending row, everything from start of day up to displaced row is all invalid. displacedRow is included if displacedRow.time === first flight time
        if (!firstInstanceInDay.start) {
          output.isValid = false
          var displacedIndex = dayEvents.findIndex(displacedRow)
          for (var j = 0; j < displacedIndex; j++) {
            output.errorRows = createErrorRow(dayEvents[j], output.errorRows)
          }
          // flight instance row will go after displacedRow if times r equal and displacedRow is an ending row
          // ie if displaced row is ending row and time is equal, it will be before flightInstance type:end and is invalid
          if (checkIfEndingRow(displacedRow) && displacedRow.time === firstInstanceInDay.time) {
            output.isValid = false
            output.errorRows = createErrorRow(displacedRow, output.errorRows)
          }
        }
        // check last flight instance is not type start
        if (lastInstanceInDay.start) {
          output.isValid = false
          // everything after last instance is invalid
          // if time is equals and displaced is endingrow, flight goes after. displaced row is still valid
          displacedIndex = dayEvents.findIndex(displacedRow)
          for (var k = displacedIndex + 1; k < dayEvents[dayEvents.length - 1]; k++) {
            output.errorRows = createErrorRow(dayEvents[k], output.errorRows)
          }
          // if time is not equal, last instance is definitely before displaced row. hence invalid
          if (checkIfEndingRow(displacedRow) && displacedRow.time !== lastInstanceInDay.time) {
            output.errorRows = createErrorRow(displacedRow, output.errorRows)
          }
        }
        // if displaced row, check it is not type ending && time equals
        var isEndingRow = checkIfEndingRow(displacedRow)
        if (isEndingRow && displacedRow.time !== firstInstanceInDay.time) {
          output.isValid = false
          output.errorRows = createErrorRow(displacedRow, output.errorRows)
        } else {
          // displaced row start time must be >= lastInstance time (since flight instances are inserted as a block). else everything from displaced row onwards is wrong
          didTimeOverlap = (displacedRow.time < lastInstanceInDay.time)
          if (didTimeOverlap) {
            output.isValid = false
            displacedIndex = dayEvents.findIndex(displacedRow)
            for (var l = displacedIndex; l < dayEvents.length - 1; l++) {
              output.errorRows = createErrorRow(dayEvents[l], output.errorRows)
            }
          }
        }
      }
    })
  }
  // passes both the boolean and row of errors
  return output
}

export default newEventTimelineValidation
