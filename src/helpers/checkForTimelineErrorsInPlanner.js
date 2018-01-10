function checkForTimelineErrorsInPlanner (events) {
  let latestUnix = 0
  let flightsTransportArr = []
  let validatedEvents = []
  events.forEach((event, i) => {
    const eventType = event.type
    const eventHasOneRow = eventType !== 'Lodging' && eventType !== 'LandTransport' && eventType !== 'Flight'
    const eventHasTwoRows = !eventHasOneRow
    let startTime, endTime
    if (eventType === 'Flight') {
      startTime = event[eventType].FlightInstance.startTime + (event[eventType].FlightInstance.startDay - 1) * 86400
      endTime = event[eventType].FlightInstance.endTime + (event[eventType].FlightInstance.endDay - 1) * 86400
    } else {
      startTime = event[eventType].startTime + (event[eventType].startDay - 1) * 86400
      endTime = event[eventType].endTime + (event[eventType].endDay - 1) * 86400
    }

    if (eventHasOneRow || (typeof event.start === 'boolean' ? event.start : true)) {
      if (startTime < latestUnix) {
        validatedEvents[i] = {...event, ...{timelineClash: true}}
        if (i > 0) {
          validatedEvents[i - 1] = {...events[i - 1], ...{timelineClash: true}}
        }
      } else {
        validatedEvents[i] = {...event, ...{timelineClash: false}}
      }
      if (eventHasOneRow && endTime > latestUnix) latestUnix = endTime
      else if (eventHasTwoRows && startTime > latestUnix) latestUnix = startTime
    } else {
      if (endTime < latestUnix) {
        validatedEvents[i] = {...event, ...{timelineClash: true}}
        if (i > 0) {
          validatedEvents[i - 1] = {...events[i - 1], ...{timelineClash: true}}
        }
      } else {
        validatedEvents[i] = {...event, ...{timelineClash: false}}
      }
      if (endTime > latestUnix) latestUnix = endTime
    }
  })
  return validatedEvents
}

export default checkForTimelineErrorsInPlanner
