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

export const allItineraries = gql`
  query allItineraries {
    allItineraries {
      id
      name
      startDate
      endDate
      pax
      travelInsurance
      budget
      countries {
        id
        name
        code
      }
      owner {
        id
        name
        email
      }
      users {
        id
        name
        email
      }
      activities {
        id
        name
      }
      food {
        id
        name
      }
      lodgings {
        id
        name
      }
      flights {
        id
        name
      }
      transports {
        id
        name
      }
    }
  }`
