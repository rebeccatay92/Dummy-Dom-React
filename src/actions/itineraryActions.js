export const createItinerary = (itinerary) => {
  return {
    type: 'CREATE_ITINERARY',
    itinerary
  }
}

export const deleteItinerary = (itinerary) => {
  return {
    type: 'DELETE_ITINERARY',
    itinerary: {
      id: 3
    }
  }
}
