// CONSTRUCT GOOGLEPLACEDATA OBJ FOR DB FROM GOOGLE PLACES/MAPS JSON OBJECT

function constructGooglePlaceDataObj (place) {
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

export default constructGooglePlaceDataObj
