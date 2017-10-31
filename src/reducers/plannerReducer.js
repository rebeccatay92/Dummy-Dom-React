export const plannerReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE_PLANNER':
      return action.activities
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
          return activity.id && activity.date !== action.activity.date
        })
        let newStateWithActivitiesWithThatDate = state.filter(activity => {
          return activity.id && activity.date === action.activity.date
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
    case 'DELETE_ACTIVITY':
      return state.filter((activity) => {
        return activity.id !== action.activity.id
      })
    case 'HOVER_OVER_ACTIVITY':
      if (!(action.index + 1)) {
        return state.filter(activity => {
          return activity.id
        })
      }
      let stateWithoutActivitiesWithThatDate = state.filter(activity => {
        return activity.id && activity.date !== action.date
      })
      let newStateWithActivitiesWithThatDate = state.filter(activity => {
        return activity.id && activity.date === action.date
      })
      return [
        ...stateWithoutActivitiesWithThatDate,
        ...[
          ...newStateWithActivitiesWithThatDate.slice(0, action.index),
          ...[{
            id: '',
            name: '',
            location: '',
            date: action.date
          }],
          ...newStateWithActivitiesWithThatDate.slice(action.index, newStateWithActivitiesWithThatDate.length)
        ]
      ]
    case 'PLANNERACTIVITY_HOVER_OVER_ACTIVITY':
      if (!(action.index + 1)) {
        return state.filter(activity => {
          return activity.id && activity.id !== action.activity.id
        })
      }
      let stateWithoutPlannerActivitiesWithThatDate = state.filter(activity => {
        return activity.id && activity.date !== action.date && activity.id !== action.activity.id
      })
      let newStateWithPlannerActivitiesWithThatDate = state.filter(activity => {
        return activity.id && activity.date === action.date && activity.id !== action.activity.id
      })
      return [
        ...stateWithoutPlannerActivitiesWithThatDate,
        ...[
          ...newStateWithPlannerActivitiesWithThatDate.slice(0, action.index),
          ...[{
            id: '',
            name: '',
            location: '',
            date: action.date
          }],
          ...newStateWithPlannerActivitiesWithThatDate.slice(action.index, newStateWithPlannerActivitiesWithThatDate.length)
        ]
      ]
    case 'HOVER_OUTSIDE_PLANNER':
      return state.filter(activity => {
        return activity.id
      })
    default:
      return state
  }
}
