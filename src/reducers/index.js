import { combineReducers } from 'redux'
import { plannerReducer } from './plannerReducer'
import { bucketReducer } from './bucketReducer'
import { userReducer } from './userReducer'
import { cloudStorageReducer } from './cloudStorageReducer'

export const allReducers = combineReducers({
  token: userReducer,
  plannerActivities: plannerReducer,
  bucketList: bucketReducer,
  cloudStorageToken: cloudStorageReducer
})
