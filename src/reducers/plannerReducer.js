export const plannerReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE_PLANNER':
      return action.activities
    case 'DROP_ACTIVITY':
      if (action.index === 'none') {
        return [
          ...state.filter(activity => {
            return activity.id
          }),
          action.activity
        ]
      } else {
        let stateWithoutActivitiesWithThatDate = state.filter(activity => {
          return activity.id && (activity.day || activity.startDay || activity.endDay || activity.departureDay) !== (action.activity.day || action.activity.startDay || action.activity.endDay || action.activity.departureDay)
        })
        let newStateWithActivitiesWithThatDate = state.filter(activity => {
          return activity.id && (activity.day || activity.startDay || activity.endDay || activity.departureDay) === (action.activity.day || action.activity.startDay || action.activity.endDay || action.activity.departureDay)
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
        return activity.id && activity.day !== action.day
      })
      let newStateWithActivitiesWithThatDate = state.filter(activity => {
        return activity.id && activity.day === action.day
      })
      return [
        ...stateWithoutActivitiesWithThatDate,
        ...[
          ...newStateWithActivitiesWithThatDate.slice(0, action.index),
          ...[{
            id: '',
            name: '',
            location: '',
            startDay: action.day
          }],
          ...newStateWithActivitiesWithThatDate.slice(action.index, newStateWithActivitiesWithThatDate.length)
        ]
      ]
    case 'PLANNERACTIVITY_HOVER_OVER_ACTIVITY':
      // console.log(state, action.activity)
      if (!(action.index + 1)) {
        return state.filter(activity => {
          const types = {
            Activity: 'Activity',
            Flight: 'Flight',
            Food: 'Food',
            Transport: 'Transport',
            Lodging: activity.startDay ? 'LodgingCheckin' : 'LodgingCheckout'
          }
          const draggedtypes = {...types, ...{ Lodging: action.activity.startDay ? 'LodgingCheckin' : 'LodgingCheckout' }}
          return activity.id && (activity.id !== action.activity.id || types[activity.type] !== draggedtypes[action.activity.type])
        })
      }
      let stateWithoutPlannerActivitiesWithThatDate = state.filter(activity => {
        const types = {
          Activity: 'Activity',
          Flight: 'Flight',
          Food: 'Food',
          Transport: 'Transport',
          Lodging: activity.startDay ? 'LodgingCheckin' : 'LodgingCheckout'
        }
        const draggedtypes = {...types, ...{ Lodging: action.activity.startDay ? 'LodgingCheckin' : 'LodgingCheckout' }}
        return activity.id && (activity.startDay || activity.departureDay || activity.endDay) !== (action.day || action.startDay || action.departureDay || action.endDay) && (activity.id !== action.activity.id || types[activity.type] !== draggedtypes[action.activity.type])
      })
      let newStateWithPlannerActivitiesWithThatDate = state.filter(activity => {
        const types = {
          Activity: 'Activity',
          Flight: 'Flight',
          Food: 'Food',
          Transport: 'Transport',
          Lodging: activity.startDay ? 'LodgingCheckin' : 'LodgingCheckout'
        }
        const draggedtypes = {...types, ...{ Lodging: action.activity.startDay ? 'LodgingCheckin' : 'LodgingCheckout' }}
        return activity.id && (activity.startDay || activity.departureDay || activity.endDay) === (action.day || action.startDay || activity.departureDay || action.endDay) && (activity.id !== action.activity.id || types[activity.type] !== draggedtypes[action.activity.type])
      })
      return [
        ...stateWithoutPlannerActivitiesWithThatDate,
        ...[
          ...newStateWithPlannerActivitiesWithThatDate.slice(0, action.index),
          ...[{
            id: '',
            name: '',
            location: '',
            startDay: action.day
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
