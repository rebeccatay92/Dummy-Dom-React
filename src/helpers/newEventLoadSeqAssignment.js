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

function newEventLoadSeqAssignment (eventsArr, eventModel, newEvent) {

  var events = JSON.parse(JSON.stringify(eventsArr))
  var allEventsWithTime = events.map(event => {
    if (event.type === 'Flight') {
      event.time = event.start ? event.Flight.FlightInstance.startTime : event.Flight.FlightInstance.endTime
    } else if (event.type === 'Transport' || event.type === 'Lodging') {
      event.time = event.start ? event[event.type].startTime : event[event.type].endTime
    } else {
      event.time = event[event.type].startTime
    }
    return event
  })
  var loadSequenceInput = [] //for changing load seq of existing events

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
        // console.log('displacedRow', displacedRow)
        var index = dayEvents.indexOf(displacedRow)
        // console.log('index', index)

        if (typeof(displacedRow.start) === 'boolean' && !displacedRow.start) {
          console.log('displacing start: false, insert after displacedRow')
          dayEvents.splice(index + 1, 0, 'placeholder')
        } else {
          console.log('allowed: insert before displacedRow')
          dayEvents.splice(index, 0, 'placeholder')
        }

        console.log('inserted', dayEvents)
        dayEvents.forEach(event => {
          var correctLoadSeq = dayEvents.indexOf(event) + 1
          if (event.modelId && event.loadSequence !== correctLoadSeq) {
            var inputObj = {
              type: event.type === 'Flight' ? 'FlightInstance' : event.type,
              id: event.type === 'Flight' ? event.Flight.FlightInstance.id : event.modelId,
              loadSequence: correctLoadSeq,
              day: event.day
            }
            if (event.type === 'Flight' || event.type === 'Transport' || event.type === 'Lodging') {
              inputObj.start = event.start
            }
            loadSequenceInput.push(inputObj)
          } else if (event === 'placeholder') {
            newEvent.loadSequence = correctLoadSeq
          }
        })
      }
    }
  } // close activity and food
  if (eventModel === 'Flight') {
    /*
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
      dayInstanceRows.forEach(row => {
        // find displaced row index
        var displacedRow = dayEvents.find(e => {
          return (e.time >= row.time)
        })
        var index = dayEvents.indexof(displacedRow)
      })
    })
    */
    
    // QUEUE???

    /*
    SPLICE INDEX + 1 DOES NOT WORK IF THERE ARE MULTIPLE DISPLACING ROWS!!! <event><instance1><instance2> can end up becoming <event><instance2><instance1>

    flightInstances = [<instance>,<instance>,<instance>]
    flightInstanceRows = [<start><end><start><end><start><end>]
    split into days and assign load sequences
    dayEvents = [<event>,<start>,<end>,<event>,<start>]
    if <start> or <end> push correctLoadSeq into aggregated arr
    flightInstanceLoadSeqs =[<1><2><3><1><2><3>]
    if <event>, check and change load seq
    after looped through all days, changingLoadSeq arr is finished,
    now to assign start/end loadSeq for allFlightInstances
    */
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
