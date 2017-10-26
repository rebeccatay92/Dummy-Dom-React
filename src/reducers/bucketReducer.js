export const bucketReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE_BUCKET':
      return action.activities
      break;
    case 'ADD_ACTIVITY_TO_BUCKET':
      return [
        ...state,
        action.activity
      ]
    case 'DELETE_ACTIVITY_FROM_BUCKET':
      return state.filter((activity) => {
        return (activity.id !== action.activity.id)
      })
    default:
      return state
  }
}
