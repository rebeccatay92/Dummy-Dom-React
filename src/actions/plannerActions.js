export const addActivity = (activity, index = 'none') => {
  return {
    type: 'ADD_ACTIVITY',
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

export const hoverOverActivity = (index) => {
  return {
    type: 'HOVER_OVER_ACTIVITY',
    index
  }
}

export const hoverOutsidePlanner = () => {
  return {
    type: 'HOVER_OUTSIDE_PLANNER'
  }
}

export const plannerActivityHoverOverActivity = (index, activity) => {
  return {
    type: 'PLANNERACTIVITY_HOVER_OVER_ACTIVITY',
    index,
    activity
  }
}
