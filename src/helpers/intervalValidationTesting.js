// eventObj = {
//   startDay,
//   endDay,
//   startTime,
//   endTime
// }

// for each event, construct interval [startTime, endTime]. if day > 1, add days*86400
// lodging are 2 point intervals [start, start], [end, end]
// interval arr [[start,end], [start, end], [start, end]]
// eventIdArr [[Activity1], [Food2], [Lodging3]]

export function validateIntervals (eventsArr, eventObj) {
  var eventsAlreadyAdded = [] // 'Activity1'
  var intervalArr = []
  var incomingStartUnix = (eventObj.startDay - 1) * 86400 + eventObj.startUnix
  var incomingEndUnix = (eventObj.endDay - 1) * 86400 + eventObj.endUnix
  var incomingInterval = [incomingStartUnix, incomingEndUnix]

  eventsArr.forEach(e => {
    if (e.type !== 'Flight') {
      var eventId = `${e.type}${e.modelId}`
    } else {
      eventId = `FlightInstance${e.Flight.FlightInstance.id}`
    }

    if (!eventsAlreadyAdded.includes(eventId)) {
      // if not alrdy in arr, find absolute start unix, absolute end unix. depends on models.
      var absoluteStartUnix = null
      var absoluteEndUnix = null
      if (e.type === 'Flight') {
        var instance = e.Flight.FlightInstance
        eventsAlreadyAdded.push(`FlightInstance${instance.id}`)
        var startDay = instance.startDay
        var startTime = instance.startTime
        var endDay = instance.endDay
        var endTime = instance.endTime
        absoluteStartUnix = (startDay - 1) * (86400) + startTime
        absoluteEndUnix = (endDay - 1) * 86400 + endTime
        intervalArr.push([absoluteStartUnix, absoluteEndUnix])
      } else if (e.type === 'Lodging') {
        // for lodging make 2 intervals (point)
        eventsAlreadyAdded.push(`${e.type}${e.modelId}`)
        eventsAlreadyAdded.push(`${e.type}${e.modelId}`)
        startDay = e[`${e.type}`].startDay
        startTime = e[`${e.type}`].startTime
        endDay = e[`${e.type}`].endDay
        endTime = e[`${e.type}`].endTime
        absoluteStartUnix = (startDay - 1) * (86400) + startTime
        absoluteEndUnix = (endDay - 1) * 86400 + endTime
        intervalArr.push([absoluteStartUnix, absoluteStartUnix])
        intervalArr.push([absoluteEndUnix, absoluteEndUnix])
      } else {
        eventsAlreadyAdded.push(`${e.type}${e.modelId}`)
        startDay = e[`${e.type}`].startDay
        startTime = e[`${e.type}`].startTime
        endDay = e[`${e.type}`].endDay
        endTime = e[`${e.type}`].endTime
        absoluteStartUnix = (startDay - 1) * (86400) + startTime
        absoluteEndUnix = (endDay - 1) * 86400 + endTime
        intervalArr.push([absoluteStartUnix, absoluteEndUnix])
      }
    }
  })
  console.log('eventsAlreadyAdded', eventsAlreadyAdded)
  console.log('intervalArr', intervalArr)
}
