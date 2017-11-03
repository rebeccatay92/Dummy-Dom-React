export const plannerReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE_PLANNER':
      return action.activities.sort(
        (a, b) => {
          const loadSequence = activity => {
            return activity.loadSequence || activity.startLoadSequence || activity.endLoadSequence || activity.departureLoadSequence
          }
          return loadSequence(a) - loadSequence(b)
        }
      )
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
          return activity.id && (activity.date || activity.startDate || activity.endDate || activity.departureDate) !== (action.activity.date || action.activity.startDate || action.activity.endDate || action.activity.departureDate)
        })
        let newStateWithActivitiesWithThatDate = state.filter(activity => {
          return activity.id && (activity.date || activity.startDate || activity.endDate || activity.departureDate) === (action.activity.date || action.activity.startDate || action.activity.endDate || action.activity.departureDate)
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
      // console.log(state, action.activity)
      if (!(action.index + 1)) {
        return state.filter(activity => {
          const types = {
            Activity: 'Activity',
            Flight: 'Flight',
            Food: 'Food',
            Transport: 'Transport',
            Lodging: activity.startDate ? 'LodgingCheckin' : 'LodgingCheckout'
          }
          const draggedtypes = {...types, ...{ Lodging: action.activity.startDate ? 'LodgingCheckin' : 'LodgingCheckout' }}
          return activity.id && (activity.id !== action.activity.id || types[activity.__typename] !== draggedtypes[action.activity.__typename])
        })
      }
      let stateWithoutPlannerActivitiesWithThatDate = state.filter(activity => {
        const types = {
          Activity: 'Activity',
          Flight: 'Flight',
          Food: 'Food',
          Transport: 'Transport',
          Lodging: activity.startDate ? 'LodgingCheckin' : 'LodgingCheckout'
        }
        const draggedtypes = {...types, ...{ Lodging: action.activity.startDate ? 'LodgingCheckin' : 'LodgingCheckout' }}
        return activity.id && (activity.date || activity.startDate || activity.departureDate || activity.endDate) !== (action.date || action.startDate || action.departureDate || action.endDate) && (activity.id !== action.activity.id || types[activity.__typename] !== draggedtypes[action.activity.__typename])
      })
      let newStateWithPlannerActivitiesWithThatDate = state.filter(activity => {
        const types = {
          Activity: 'Activity',
          Flight: 'Flight',
          Food: 'Food',
          Transport: 'Transport',
          Lodging: activity.startDate ? 'LodgingCheckin' : 'LodgingCheckout'
        }
        const draggedtypes = {...types, ...{ Lodging: action.activity.startDate ? 'LodgingCheckin' : 'LodgingCheckout' }}
        return activity.id && (activity.date || activity.startDate || activity.departureDate || activity.endDate) === (action.date || action.startDate || activity.departureDate || action.endDate) && (activity.id !== action.activity.id || types[activity.__typename] !== draggedtypes[action.activity.__typename])
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
