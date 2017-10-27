import { gql } from 'react-apollo'

export const queryItinerary = gql`
  query queryItinerary($id: ID!) {
    findItinerary(id: $id){
      name
      startDate
      endDate
      activities {
        id
        name
        location {
          name
        }
        date
      }
    }
  }`
