// TAKING IN AN EVENTS ARR, MODEL NAME, AND NEWEVENT OBJ

function newEventTimelineValidation (eventsArr, model, newEvent) {
  // construct timeline arr. lodging gets point timings for checkin and checkout
  console.log('eventsArr', eventsArr)
  if (model === 'Activity' || model === 'Food') {
    var isSameDay = (newEvent.startDay === newEvent.endDay)
    if (isSameDay) {
      // take out dayEvents
      var dayEvents = eventsArr.filter(e => {
        return e.day === newEvent.startDay
      })
      console.log('dayEvents', dayEvents)
      // var timelineArr = []
      // dayEvents.forEach(event => {
      //   if (event.type !== 'Activity' && event.type !== 'Food') {
      //     timelineArr.push({
      //       type: event.type,
      //       start: event.start,
      //       time: event.time
      //     })
      //   }
      // })
      console.log('startTime', newEvent.startTime, 'endTime', newEvent.endTime)
      // if start unix is in between anything clash, if end unix is in between anything => clash
      // if both dont cut between start and end, find the row startUnix displaces, end unix must also be before displacedRow
    } else { // if different start and end day
      // must be last on day1 (only one row)
      // end time must be earlier than first event on next day
      // take out startDayEvents. check last event.
    }
  }
}

export default newEventTimelineValidation
