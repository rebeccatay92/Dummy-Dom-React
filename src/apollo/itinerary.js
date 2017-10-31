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

// include country code. coutnryIdArr
export const createItinerary = gql`
  mutation createItinerary($UserId: Int!, $CountryId: [Int!], $name: String!, $startDate: Int, $endDate: Int, $pax: Int, $travelInsurance: String, $budget: Int) {
    createItinerary(UserId:$UserId, CountryId: $CountryId, name: $name, startDate: $startDate, endDate: $endDate, pax: $pax, travelInsurance: $travelInsurance, budget: $budget) {
      id
      name
      startDate
      endDate
      pax
      travelInsurance
      budget
    }
  }`
