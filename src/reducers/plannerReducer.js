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
        let stateWithoutActivitiesWithThatDate = state.filter(activity => {
          return activity.id && activity.startDate !== action.activity.startDate
        })
        let newStateWithActivitiesWithThatDate = state.filter(activity => {
          return activity.id && activity.startDate === action.activity.startDate
        })
        return [
          ...stateWithoutActivitiesWithThatDate,
          ...[
            ...newStateWithActivitiesWithThatDate.slice(0, action.index),
            ...[action.activity],
            ...newStateWithActivitiesWithThatDate.slice(action.index, newStateWithActivitiesWithThatDate.length)
          ]
        ]
      }
      break;
    case 'DELETE_ACTIVITY':
      return state.filter((activity) => {
        return activity.id !== action.activity.id
      })
      break;
    case 'HOVER_OVER_ACTIVITY':
      let stateWithoutActivitiesWithThatDate = state.filter(activity => {
        return activity.id && activity.startDate !== action.date
      })
      let newStateWithActivitiesWithThatDate = state.filter(activity => {
        return activity.id && activity.startDate === action.date
      })
      return [
        ...stateWithoutActivitiesWithThatDate,
        ...[
          ...newStateWithActivitiesWithThatDate.slice(0, action.index),
          ...[{
            id: '',
            name: '',
            city: '',
            startDate: action.date
          }],
          ...newStateWithActivitiesWithThatDate.slice(action.index, newStateWithActivitiesWithThatDate.length)
        ]
      ]
      break;
    case 'PLANNERACTIVITY_HOVER_OVER_ACTIVITY':
      let stateWithoutPlannerActivitiesWithThatDate = state.filter(activity => {
        return activity.id && activity.startDate !== action.date && activity.id !== action.activity.id
      })
      let newStateWithPlannerActivitiesWithThatDate = state.filter(activity => {
        return activity.id && activity.startDate === action.date && activity.id !== action.activity.id
      })
      return [
        ...stateWithoutPlannerActivitiesWithThatDate,
        ...[
          ...newStateWithPlannerActivitiesWithThatDate.slice(0, action.index),
          ...[{
            id: '',
            name: '',
            city: '',
            startDate: action.date
          }],
          ...newStateWithPlannerActivitiesWithThatDate.slice(action.index, newStateWithPlannerActivitiesWithThatDate.length)
        ]
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
