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

// export const updateItinerary = (itinerary) => {
//   return {
//     type: 'UPDATE_ITINERARY',
//     itinerary
//   }
// }
