import moment from 'moment'

export function findDayOfWeek (datesArr, dayInt) {
  var dateUnix = datesArr[dayInt - 1]
  var momentTime = moment.utc(dateUnix)
  var momentDayInt = parseInt(momentTime.format('d'))
  return momentDayInt
}

export function findOpenAndCloseUnix (dayOfWeek, googlePlaceDetails) {
  var allPeriods = googlePlaceDetails.opening_hours.periods
  var period = allPeriods.find(e => {
    return e.open.day === dayOfWeek
  })

  var output = ['open', 'close'].map(e => {
    var hours = parseInt(period[e].time.substring(0, 2))
    var mins = parseInt(period[e].time.substring(2, 4))
    return (hours * 3600) + (mins * 60)
  })

  if (period.close.day === period.open.day + 1) {
    output[1] += (24 * 60 * 60)
  }

  return output
}
