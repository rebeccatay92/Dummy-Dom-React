export const initializePlanner = (activities) => {
  return {
    type: 'INITIALIZE_PLANNER',
    activities
  }
}

export const addActivity = (activity, index = 'none') => {
  return {
    type: 'DROP_ACTIVITY',
    activity,
    index
  }
}

export const deleteActivity = (activity) => {
  return {
    type: 'DELETE_ACTIVITY',
    activity
  }
}

export const hoverOverActivity = (index, date) => {
  return {
    type: 'HOVER_OVER_ACTIVITY',
    index,
    date
  }
}

export const hoverOutsidePlanner = () => {
  return {
    type: 'HOVER_OUTSIDE_PLANNER'
  }
}

export const plannerActivityHoverOverActivity = (index, activity, date) => {
  return {
    type: 'PLANNERACTIVITY_HOVER_OVER_ACTIVITY',
    index,
    activity,
    date
  }
}
