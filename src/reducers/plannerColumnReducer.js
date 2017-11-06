export const plannerColumnReducer = (state = ['Price', 'Booking Status', 'Booking Platform'], action) => {
  switch (action.type) {
    case 'CHANGE_COLUMNS':
      return action.columns
    default:
      return state
  }
}
