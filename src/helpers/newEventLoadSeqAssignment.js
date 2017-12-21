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

// if model is activity / food / transport / lodging, newEvent = {}
// if model is flight, newEvent = [{flightInstance},{},{}]
// find insertion index
// insert newEvent into daysEvents arr, then compare index with load seq

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
  var loadSequenceInput = []

  if (eventModel === 'Activity' || eventModel === 'Food') {
    var daysEvents = allEventsWithTime.filter(e => {
      return e.day === newEvent.startDay
    })

    if (!newEvent.startTime) {
      newEvent.loadSequence = daysEvents.length + 1
    } else {
      var displacedRow = daysEvents.find(e => {
        return (e.time >= newEvent.startTime)
      })
      if (!displacedRow) {
        newEvent.loadSequence = daysEvents.length + 1
      } else {
        // console.log('displacedRow', displacedRow)
        var index = daysEvents.indexOf(displacedRow)
        // console.log('index', index)

        if (typeof(displacedRow.start) === 'boolean' && !displacedRow.start) {
          console.log('displacing start: false, insert after displacedRow')
          daysEvents.splice(index + 1, 0, newEvent)
        } else {
          console.log('allowed: insert before displacedRow')
          daysEvents.splice(index, 0, newEvent)
        }

        // console.log('inserted', daysEvents)
        daysEvents.forEach(event => {
          var correctLoadSeq = daysEvents.indexOf(event) + 1
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
          } else if (event.ItineraryId) {
            newEvent.loadSequence = correctLoadSeq
          }
        })
      }
    }
    // console.log('newEvent after assigning load seq', newEvent)
    // console.log('loadSequenceInput', loadSequenceInput)
  } // close activity and food

  var output = {
    newEvent,
    loadSequenceInput
  }
  return output
}

export default newEventLoadSeqAssignment
