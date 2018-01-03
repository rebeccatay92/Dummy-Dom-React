// TAKING IN AN EVENTS ARR, MODEL NAME, AND NEWEVENT OBJ

function newEventTimelineValidation (eventsArr, model, newEvent) {
  // construct timeline arr. lodging gets point timings for checkin and checkout
  // console.log('eventsArr', eventsArr)
  if (model === 'Activity' || model === 'Food') {
    var isSameDay = (newEvent.startDay === newEvent.endDay)
    if (isSameDay) {
      var dayEvents = eventsArr.filter(e => {
        return e.day === newEvent.startDay
      })
      console.log('dayEvents', dayEvents)
      console.log('startTime', newEvent.startTime, 'endTime', newEvent.endTime)
      var displacedRow = dayEvents.find(e => {
        return (e.time >= newEvent.startTime)
      })

      if (!displacedRow) {
        // if displacedRow is null (last event), check start:true is not before it (excluding lodging)
        var displacedIndex = dayEvents.indexOf(displacedRow)
        var previousRow = dayEvents[displacedIndex - 1]
        var isStartingRow = (typeof (previousRow.start) === 'boolean' && previousRow.start && previousRow.type !== 'Lodging')
        // if isStartingRow is true, validation error.
      }
      // if displacedRow exists, check if it is an ending row of type start:false (not lodging)
      // if displacedRow exists but not an ending row, check end time is also before displaced time, else overlap
    } else { // if different start and end day
      // must be last on day1 (only one row)
      // end time must be earlier than first event on next day
      // take out startDayEvents. check last event.
    }
  }
}

export default newEventTimelineValidation
