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

      // equals or not equals????
      var displacedRow = dayEvents.find(e => {
        return (e.time > newEvent.startTime)
      })

      if (!displacedRow) {
        console.log('no displaced row')
        // if no displaced row (insert right at end), check last row in that day is not of type start:true
        // check the day at least has 1 event
        if (dayEvents.length < 1) return isValid
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
            console.log('endtimeoverlap')
            isValid = false
          }
          // check row before displaced row. newEvent start time must be after previous ending
          // check only if previous row does exist. else no endtime to clash with
          var displacedIndex = dayEvents.indexOf(displacedRow)
          // if (displacedIndex === 0) return // displaced row is already very first event
          // console.log('not first event')
          if (displacedIndex === 0) return isValid
          var previousRow = dayEvents[displacedIndex - 1]
          lastTiming = findEndTime(previousRow)
          if (newEvent.startTime < lastTiming) {
            console.log('start time is before previous event ended')
            isValid = false
          }
        }
      }
    } else {
      // if different start and end day
      var startDayEvents = eventsArr.filter(e => {
        return e.day === newEvent.startDay
      })
      if (startDayEvents.length === 0) return isValid
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
      if (endDayEvents.length === 0) return isValid
      var firstRowOfEndDay = endDayEvents[0]
      if (newEvent.endTime > firstRowOfEndDay.time) {
        isValid = false
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
      if (!dayEvents) return isValid

      // if type ===starting displacedRow is time > startTime
      // if type === ending, displacedRow is time >= endTime
      // var displacedRow = dayEvents.find(e => {
      //   return (e.time > newEvent[`${type}Time`])
      // })

      // if (type === 'start') {
      //   var displacedRow = dayEvents.find(e => {
      //     return (e.time > newEvent[`${type}Time`])
      //   })
      // } else if (type === 'end') {
      //   displacedRow = dayEvents.find(e => {
      //     return (e.time >= newEvent[`${type}Time`])
      //   })
      // }

      displacedRow = dayEvents.find()
      
      if (!displacedRow) {
        console.log('no displaced row')
        // last event must not be of type starting
        if (dayEvents.length < 1) return isValid
        var lastRow = dayEvents[dayEvents.length - 1]
        var isStartingRow = checkIfStartingRow(lastRow)
        if (isStartingRow) {
          console.log('trying to insert at or after starting row')
          isValid = false
        } else {
          // check if lodging start/end time is after end time of last row <last end time, time>
          var lastTiming = findEndTime(lastRow)
          var didTimeOverlap = (newEvent[`${type}Time`] < lastTiming)
          if (didTimeOverlap) {
            console.log('start time is before end time of previous row')
            isValid = false
          }
        }
      } else {
        // if there is a displaced row
        console.log('there is a displaced row')
        var isEndingRow = checkIfEndingRow(displacedRow)
        if (isEndingRow) {
          console.log('displacing an ending row')
          isValid = false
        } else {
          // if not ending row, check time > end time of previous row. (if previous row exists/ displacedrow is not the first row)
          var displacedIndex = dayEvents.indexOf(displacedRow)
          console.log('displacedIndex', displacedIndex)
          if (displacedIndex === 0) return isValid// displaced row is alrdy the very first
          var previousRow = dayEvents[displacedIndex - 1]
          lastTiming = findEndTime(previousRow)
          console.log('newevent time', newEvent[`${type}Time`], 'lastTiming', lastTiming)
          didTimeOverlap = (newEvent[`${type}Time`] < lastTiming)
          if (didTimeOverlap) {
            console.log('time overlap')
            isValid = false
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

      if (dayEvents.length < 1) return isValid
      // find displaced row.
      displacedRow = dayEvents.find(e => {
        return e.time > newEvent.startTime
      })
      if (!displacedRow) {
        // if displaced row dont exist => inserting right at end
        // check last row is not of type starting
        lastRow = dayEvents[dayEvents.length - 1]
        isStartingRow = checkIfStartingRow(lastRow)
        if (isStartingRow) {
          isValid = false
        } else {
          // starttime > lastrow end time
          lastTiming = findEndTime(lastRow)
          if (newEvent.startTime < lastTiming) {
            isValid = false
          }
        }
      } else {
        // displaced row exists, check not ending row
        isEndingRow = checkIfEndingRow(displacedRow)
        if (isEndingRow) {
          isValid = false
        } else {
          // displaced row time is > startTime, > endTime
          didEndTimeOverlap = (displacedRow.time < newEvent.endTime)
          if (didEndTimeOverlap) {
            isValid = false
          }
          // startTime >= previousRow endTime
          displacedIndex = dayEvents.indexOf(displacedRow)
          if (displacedIndex === 0) return isValid
          previousRow = dayEvents[displacedIndex - 1]
          lastTiming = findEndTime(previousRow)
          if (newEvent.startTime < lastTiming) {
            console.log('start time is before previous event ended')
            isValid = false
          }
        }
      }
    } else {
      // last on day 1
      startDayEvents = eventsArr.filter(e => {
        return e.day === newEvent.startDay
      })
      if (startDayEvents.length === 0) return isValid
      lastRow = startDayEvents[startDayEvents.length - 1]
      isStartingRow = checkIfStartingRow(lastRow)
      if (isStartingRow) {
        isValid = false
      } else {
        lastTiming = findEndTime(lastRow)
        if (newEvent.startTime < lastTiming) {
          isValid = false
        }
      }
      // first on day 2
      endDayEvents = eventsArr.filter(e => {
        return e.day === newEvent.endDay
      })
      if (endDayEvents.length === 0) return isValid
      firstRowOfEndDay = endDayEvents[0]
      if (newEvent.endTime > firstRowOfEndDay.time) {
        isValid = false
      }
    }
  }
  return isValid
}

export default newEventTimelineValidation
