// GIVEN EVENTS ARR, EVENTMODEL, MODELID AND UPDATEEVENTOBJ WITH STARTDAY,ENDDAY,STARTTIME,ENDTIME, RETURN CHANGINGLOADSEQUENCE ARR AND UPDATEEVENTOBJ WITH LOAD SEQ.

// updateEventObj = {
//   startDay,
//   endDay,
//   startTime,
//   endTime
// }

function constructLoadSeqInputObj (event, correctLoadSeq) {
  var inputObj = {
    type: event.type === 'Flight' ? 'FlightInstance' : event.type,
    id: event.type === 'Flight' ? event.Flight.FlightInstance.id : event.modelId,
    loadSequence: correctLoadSeq,
    day: event.day
  }
  if (event.type === 'Flight' || event.type === 'LandTransport' || event.type === 'SeaTransport' || event.type === 'Train' || event.type === 'Lodging') {
    inputObj.start = event.start
  }
  return inputObj
}

function checkIfEndingRow (event) {
  return (typeof (event.start) === 'boolean' && !event.start && event.type !== 'Lodging')
}

function updateEventLoadSeqAssignment (eventsArr, eventModel, modelId, updateEvent) {
  var loadSequenceInput = []

  // affectedDays are days where event is deleted, but not equal to day where event is reinserted. ie -> event moves from day 1 to day 2. day 1 is affected, day 2 is not.
  var affectedDays = []

  // remove old event and find all affected days
  var allEvents = eventsArr.filter(e => {
    if (e.type === eventModel && e.modelId === modelId) {
      if (!affectedDays.includes(e.day)) {
        affectedDays.push(e.day)
      }
    } else {
      return e
    }
  })

  if (eventModel === 'Activity' || eventModel === 'Food') {
    // affectedDays are delete only days. remove days where event needs to be reinserted
    affectedDays = affectedDays.filter(e => {
      return e !== updateEvent.startDay
    })

    // find day to reinsert, then find displacedRow
    var dayEvents = allEvents.filter(e => {
      return e.day === updateEvent.startDay
    })
    var displacedRow = dayEvents.find(e => {
      if (typeof (updateEvent.startTime) === 'number') {
        return (e.time >= updateEvent.startTime)
      } else {
        return null
      }
    })

    if (!displacedRow) {
      updateEvent.loadSequence = dayEvents.length + 1
    } else {
      var index = dayEvents.indexOf(displacedRow)
      if (checkIfEndingRow(displacedRow) && displacedRow.time === updateEvent.startTime) {
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
          updateEvent.loadSequence = correctLoadSeq
        }
      })
    }

    // change load seq for affectedDays (days where event was removed only)
    affectedDays.forEach(day => {
      dayEvents = allEvents.filter(e => {
        return e.day === day
      })
      dayEvents.forEach(event => {
        var correctLoadSeq = dayEvents.indexOf(event) + 1
        if (event.modelId && event.loadSequence !== correctLoadSeq) {
          var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
          loadSequenceInput.push(inputObj)
        }
        // wont hv placeholder since affectedDays is for days with delete only
      })
    })
  }
  if (eventModel === 'Lodging' || eventModel === 'LandTransport' || eventModel === 'SeaTransport' || eventModel === 'Train') {
    // reassign seq
  }
  if (eventModel === 'Flight') {
    // reassign seq
  }

  var output = {
    updateEvent,
    loadSequenceInput
  }
  return output
}

export default updateEventLoadSeqAssignment
