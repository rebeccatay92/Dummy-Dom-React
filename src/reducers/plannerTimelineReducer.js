export const plannerTimelineReducer = (state = {events: true, days: false}, action) => {
  switch (action.type) {
    case 'TOGGLE_TIMELINE':
      return action.options
    default:
      return state
  }
}
