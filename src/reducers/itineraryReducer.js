import { itineraries } from '../itineraries'

export const itineraryReducer = (state = itineraries, action) => {
  switch (action.type) {
    case 'CREATE_ITINERARY':
      return [
        ...state,
        action.itinerary
      ]
    // case 'DELETE_ACTIVITY_FROM_BUCKET':
    //   return state.filter((activity) => {
    //     return (activity.id !== action.activity.id)
    //   })
    default:
      return state
  }
}
