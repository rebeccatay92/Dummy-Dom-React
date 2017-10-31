export const createItinerary = (itinerary) => {
  return {
    type: 'CREATE_ITINERARY',
    itinerary
  }
}

export const deleteItinerary = (id) => {
  return {
    type: 'DELETE_ITINERARY',
    id
  }
}

export const initializeItineraries = (itineraries) => {
  return {
    type: 'INITIALIZE_ITINERARIES',
    itineraries
  }
}
