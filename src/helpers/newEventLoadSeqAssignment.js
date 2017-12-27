/*
WHAT THIS DOES:
Returns newEventObjs with loadseq assigned, also returns changingLoadSequence input array

REQUIRED ARGUMENTS:
1) eventsArr from queryItinerary
2) eventModel ('Activity', 'Food', 'Lodging', 'Transport', 'FlightInstance')
3) new obj / array of new objs containing the newEvents that need to be assigned start/end load sequences (day/time required. null value ok)
eg: newActivity {startDay: 1, startTime: 32000}
eg: [{newFLightInstance}, {newFLightInstance}]
*/

// find insertion index
// insert newEvent into dayEvents arr, then compare index with load seq

// helpers for load seq assignment
function constructLoadSeqInputObj (event, correctLoadSeq) {
  var inputObj = {
    type: event.type === 'Flight' ? 'FlightInstance' : event.type,
    id: event.type === 'Flight' ? event.Flight.FlightInstance.id : event.modelId,
    loadSequence: correctLoadSeq,
    day: event.day
  }
  if (event.type === 'Flight' || event.type === 'Transport' || event.type === 'Lodging') {
    inputObj.start = event.start
  }
  return inputObj
}

// BUG: NEED TO CHECK IF ENDING ROW IS FLIGHT OR TRANSPORT TYPE. IF LODGING, NO NEED TO BUMP +1 TO THE RIGHT
function checkDisplacingEndingRow (displacedRow) {
  return (typeof (displacedRow.start) === 'boolean' && !displacedRow.start)
}

function newEventLoadSeqAssignment (eventsArr, eventModel, newEvent) {

  var events = JSON.parse(JSON.stringify(eventsArr))
  var allEventsWithTime = events.map(event => {
    if (event.type === 'Flight') {
      event.time = event.start ? event.Flight.FlightInstance.startTime : event.Flight.FlightInstance.endTime
    } else if (event.type === 'Activity' || event.type === 'Food') {
      event.time = event[event.type].startTime
    } else {
      // for transport and lodging
      event.time = event.start ? event[event.type].startTime : event[event.type].endTime
    }
    return event
  })
  // for changing load seq of existing events
  var loadSequenceInput = []

  if (eventModel === 'Activity' || eventModel === 'Food') {
    var dayEvents = allEventsWithTime.filter(e => {
      return e.day === newEvent.startDay
    })

    if (!newEvent.startTime) {
      newEvent.loadSequence = dayEvents.length + 1
    } else {
      var displacedRow = dayEvents.find(e => {
        return (e.time >= newEvent.startTime)
      })
      if (!displacedRow) {
        newEvent.loadSequence = dayEvents.length + 1
      } else {
        var index = dayEvents.indexOf(displacedRow)
        if (checkDisplacingEndingRow(displacedRow)) {
          dayEvents.splice(index + 1, 0, 'placeholder')
        } else {
          dayEvents.splice(index, 0, 'placeholder')
        }

        console.log('inserted', dayEvents)
        dayEvents.forEach(event => {
          var correctLoadSeq = dayEvents.indexOf(event) + 1
          if (event.modelId && event.loadSequence !== correctLoadSeq) {
            var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
            loadSequenceInput.push(inputObj)
          } else if (event === 'placeholder') {
            newEvent.loadSequence = correctLoadSeq
          }
        })
      }
    }
  } // close activity and food
  if (eventModel === 'Lodging') {
    // newEvent is an obj that needs both start and end load sequence
    if (newEvent.startDay === newEvent.endDay) {
      // same start and end day
      dayEvents = allEventsWithTime.filter(e => {
        return e.day === newEvent.startDay
      })

      // REFACTOR
      var types = ['start', 'end']
      types.forEach(type => {
        var isStart = (type === 'start') // true or false
        var displacedRow = dayEvents.find(event => {
          return isStart ? (event.time >= newEvent.startTime) : (event.time >= newEvent.endTime)
        })
        if (!displacedRow) {
          dayEvents.push({start: isStart})
        } else {
          index = dayEvents.indexOf(displacedRow)
          if (checkDisplacingEndingRow(displacedRow)) {
            dayEvents.splice(index + 1, 0, {start: isStart})
          } else {
            dayEvents.splice(index, 0, {start: isStart})
          }
        }
      })

      console.log('after inserting 2', dayEvents)

      dayEvents.forEach(event => {
        var correctLoadSeq = dayEvents.indexOf(event) + 1
        if (event.modelId && event.loadSeq !== correctLoadSeq) {
          var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
          loadSequenceInput.push(inputObj)
        } else if (!event.modelId && event.start) {
          newEvent.startLoadSequence = correctLoadSeq
        } else if (!event.modelId && !event.start) {
          newEvent.endLoadSequence = correctLoadSeq
        }
      })
    } else {
      // REFACTOR
      types = ['start', 'end']
      types.forEach(type => {
        var isStart = (type === 'start')
        dayEvents = allEventsWithTime.filter(e => {
          return isStart ? (e.day === newEvent.startDay) : (e.day === newEvent.endDay)
        })
        var displacedRow = dayEvents.find(event => {
          return isStart ? (event.time >= newEvent.startTime) : (event.time >= newEvent.endTime)
        })
        if (!displacedRow) {
          dayEvents.push({start: isStart})
        } else {
          index = dayEvents.indexOf(displacedRow)
          if (checkDisplacingEndingRow(displacedRow)) {
            dayEvents.splice(index + 1, 0, {start: isStart})
          } else {
            dayEvents.splice(index, 0, {start: isStart})
          }
        }
        dayEvents.forEach(event => {
          var correctLoadSeq = dayEvents.indexOf(event) + 1
          if (event.modelId && event.loadSeq !== correctLoadSeq) {
            var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
            loadSequenceInput.push(inputObj)
          } else if (!event.modelId && event.start) {
            isStart ? (newEvent.startLoadSequence = correctLoadSeq) : (newEvent.endLoadSequence = correctLoadSeq)
          }
        })
      })
    } // close else for separate days
  }
  if (eventModel === 'LandTransport' || eventModel === 'SeaTransport' || eventModel === 'Train') {
    // assign load seq for transport
  }
  if (eventModel === 'Flight') {

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

    var flightInstanceLoadSeqs = [] // for assigning  start/end loadseq
    days.forEach(day => {
      var dayEvents = allEventsWithTime.filter(e => {
        return e.day === day
      })
      var dayInstanceRows = flightInstanceRows.filter(e => {
        return e.day === day
      })

      // inserting entire day's instances as a group,
      var displacedRow = dayEvents.find(e => {
        return (e.time >= dayInstanceRows[0].time)
      })
      if (!displacedRow) {
        // add all to the end, no change in load seq for current events
        dayEvents.push(...dayInstanceRows)
      } else if (displacedRow) {
        var index = dayEvents.indexOf(displacedRow)

        if (checkDisplacingEndingRow(displacedRow)) {
          dayEvents.splice(index + 1, 0, ...dayInstanceRows)
        } else {
          dayEvents.splice(index, 0, ...dayInstanceRows)
        }
      }

      dayEvents.forEach(event => {
        var correctLoadSeq = dayEvents.indexOf(event) + 1
        if (event.modelId && event.loadSequence !== correctLoadSeq) {
          var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
          loadSequenceInput.push(inputObj)
        } else if (!event.modelId) {
          flightInstanceLoadSeqs.push(correctLoadSeq)
        }
      })

      // after looping through all the days, flightInstanceLoadSeqs and loadSequenceInput should be filled. assign start/end load seq to flightinstances
      for (var i = 0; i < newEvent.length; i++) {
        newEvent[i].startLoadSequence = flightInstanceLoadSeqs[(2 * i)]
        newEvent[i].endLoadSequence = flightInstanceLoadSeqs[(2 * i) + 1]
      }
    })
  }

  console.log('newEvent after assigning load seq', newEvent)
  console.log('loadSequenceInput', loadSequenceInput)

  var output = {
    newEvent,
    loadSequenceInput
  }

  return output
}

export default newEventLoadSeqAssignment
