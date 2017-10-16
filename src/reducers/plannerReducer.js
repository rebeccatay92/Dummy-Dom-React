export const plannerReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ACTIVITY':
      if (action.index === 'none') {
        return [
          ...state.filter(activity => {
            return activity.id
          }),
          action.activity
        ]
      } else {
        let newState = state.filter(activity => {
          return activity.id
        })
        return [
          ...newState.slice(0, action.index),
          ...[action.activity],
          ...newState.slice(action.index, state.length)
        ]
      }
      break;
    case 'DELETE_ACTIVITY':
      return state.filter((activity) => {
        return (activity.id !== action.activity.id)
      })
      break;
    case 'HOVER_OVER_ACTIVITY':
      let newState = state.filter(activity => {
        return activity.id
      })
      return [
        ...newState.slice(0, action.index),
        ...[{
          id: '',
          name: '',
          city: ''
        }],
        ...newState.slice(action.index, state.length)
      ]
      break;
    case 'PLANNERACTIVITY_HOVER_OVER_ACTIVITY':
      let newState2 = state.filter(activity => {
        return activity.id && activity.id !== action.activity.id
      })
      return [
        ...newState2.slice(0, action.index),
        ...[{
          id: '',
          name: '',
          city: ''
        }],
        ...newState2.slice(action.index, state.length)
      ]
      break;
    case 'HOVER_OUTSIDE_PLANNER':
      return state.filter(activity => {
        return activity.id
      })
      break;
    default:
      return state
  }
}
