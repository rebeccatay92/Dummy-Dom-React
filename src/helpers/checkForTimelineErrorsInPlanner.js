const _ = require('lodash')

function checkForTimelineErrorsInPlanner (events) {
  let latestUnix = 0
  let flightsTransportArr = []
  let validatedEvents = []
  events.forEach((event, i) => {
    const eventType = event.type
    const eventHasOneRow = eventType !== 'Lodging' && eventType !== 'LandTransport' && eventType !== 'Flight'
    const eventHasTwoRows = !eventHasOneRow
    const eventCannotHaveAnythingInBetween = eventType === 'LandTransport' || eventType === 'Flight'
    // Check for time clash
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
          validatedEvents[i - 1] = {...validatedEvents[i - 1], ...{timelineClash: true}}
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
          validatedEvents[i - 1] = {...validatedEvents[i - 1], ...{timelineClash: true}}
        }
      } else {
        validatedEvents[i] = {...event, ...{timelineClash: false}}
      }
      if (endTime > latestUnix) latestUnix = endTime
    }

    // Check for events between flights/transport start and end rows
    const id = eventType === 'Flight' ? event[eventType].FlightInstance.id : event[eventType].id
    const obj = {
      type: eventType,
      id: id
    }
    if (eventCannotHaveAnythingInBetween) {
      if (_.some(flightsTransportArr, obj)) {
        flightsTransportArr = flightsTransportArr.filter(event => !_.isEqual(obj, event))
      } else {
        flightsTransportArr.push(obj)
      }
    }
    if (flightsTransportArr.length > 0 && !_.some(flightsTransportArr, obj)) {
      validatedEvents[i] = {...validatedEvents[i], ...{inBetweenStartEndRow: true}}
    } else {
      validatedEvents[i] = {...validatedEvents[i], ...{inBetweenStartEndRow: false}}
    }
  })
  return validatedEvents
}

export default checkForTimelineErrorsInPlanner
