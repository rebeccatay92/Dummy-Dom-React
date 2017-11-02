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
