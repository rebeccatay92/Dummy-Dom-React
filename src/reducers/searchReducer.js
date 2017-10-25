import { fakeresults } from '../fakeresults'


export const searchReducer = (state = fakeresults, action) => {
  switch (action.type) {
    // reducers here
    case 'SEARCH_PLACES':
      return [
        ...state,
        action.str
      ]
    default:
      return state
  }
}
