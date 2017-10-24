import { combineReducers } from 'redux'
import { plannerReducer } from './plannerReducer'
import { bucketReducer } from './bucketReducer'
import { itineraryReducer } from './itineraryReducer'

export const allReducers = combineReducers({
  plannerActivities: plannerReducer,
  bucketList: bucketReducer,
  itineraryList: itineraryReducer
})
