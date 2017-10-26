import { combineReducers } from 'redux'
import { plannerReducer } from './plannerReducer'
import { bucketReducer } from './bucketReducer'
import { itineraryReducer } from './itineraryReducer'
import { searchReducer } from './searchReducer'

export const allReducers = combineReducers({
  plannerActivities: plannerReducer,
  bucketList: bucketReducer,
  itineraryList: itineraryReducer,
  searchResults: searchReducer
})
