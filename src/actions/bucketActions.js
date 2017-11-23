export const addActivityToBucket = (activity) => {
  return {
    type: 'ADD_ACTIVITY_TO_BUCKET',
    activity
  }
}

export const deleteActivityFromBucket = (activity) => {
  return {
    type: 'DELETE_ACTIVITY_FROM_BUCKET',
    activity
  }
}

export const initializeBucket = (activities) => {
  return {
    type: 'INITIALIZE_BUCKET',
    activities
  }
}
