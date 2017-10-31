// import { itineraries } from '../itineraries'

export const itineraryReducer = (state = [], action) => {
  switch (action.type) {
    // case 'INITIALIZE_ITINERARIES':
    //   return action.itineraries
    case 'CREATE_ITINERARY':
      return [
        ...state,
        action.itinerary
      ]
    case 'DELETE_ITINERARY':
      return state.filter((itinerary) => {
        return (itinerary.id !== action.id)
      })
    default:
      return state
  }
}
