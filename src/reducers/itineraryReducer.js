import { itineraries } from '../itineraries'

export const itineraryReducer = (state = itineraries, action) => {
  switch (action.type) {
    case 'CREATE_ITINERARY':
      return [
        ...state,
        action.itinerary
      ]
    case 'DELETE_ITINERARY':
      return state.filter((itinerary) => {
        return (itinerary.id !== action.itinerary.id)
      })
    default:
      return state
  }
}
