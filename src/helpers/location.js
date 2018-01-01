import moment from 'moment'

// CONSTRUCT GOOGLEPLACEDATA OBJ FOR DB FROM GOOGLE PLACES/MAPS JSON OBJECT
export function constructGooglePlaceDataObj (place) {
  var googlePlaceData = {
    placeId: place.place_id,
    countryCode: null,
    name: place.name,
    address: place.formatted_address,
    latitude: null,
    longitude: null,
    openingHours: null
  }
  if (place.opening_hours && place.opening_hours.periods) {
    googlePlaceData.openingHours = JSON.stringify(place.opening_hours.periods)
  }
  place.address_components.forEach(e => {
    if (e.types.includes('country')) {
      googlePlaceData.countryCode = e.short_name
    }
  })

  // depending on whether lat/lng comes from search or map
  if (typeof (place.geometry.location.lat) === 'number') {
    googlePlaceData.latitude = place.geometry.location.lat
    googlePlaceData.longitude = place.geometry.location.lng
  } else {
    googlePlaceData.latitude = place.geometry.location.lat()
    googlePlaceData.longitude = place.geometry.location.lng()
  }
  return googlePlaceData
}

// CONSTRUCT LOCATIONDETAILS OBJ TO PASS DOWN AS PROPS FOR RENDERING
export function constructLocationDetails (googlePlaceDetails, datesArr, dayInt) {
  var locationDetails = {
    address: googlePlaceDetails.formatted_address,
    telephone: googlePlaceDetails.international_phone_number || googlePlaceDetails.formatted_phone_number
  }
  var dateUnix = datesArr[dayInt - 1]
  var momentTime = moment.utc(dateUnix)
  var momentDayStr = momentTime.format('dddd')
  if (googlePlaceDetails.opening_hours && googlePlaceDetails.opening_hours.weekday_text) {
    var text = googlePlaceDetails.opening_hours.weekday_text.filter(e => {
      return e.indexOf(momentDayStr) > -1
    })
    locationDetails.openingHours = text
  }

  return locationDetails
}
