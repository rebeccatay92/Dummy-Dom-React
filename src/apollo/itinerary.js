import { gql } from 'react-apollo'

export const queryItinerary = gql`
  query queryItinerary($id: ID!) {
    findItinerary(id: $id){
      name
      countries {
        name
      }
      startDate
      endDate
      activities {
        id
        name
        startTime
        endTime
        location {
          id
          name
        }
        date
        loadSequence
      }
      flights {
        id
        name
        departureLocation {
          id
          name
        }
        arrivalLocation {
          id
          name
        }
        departureDate
        arrivalDate
        departureTime
        arrivalTime
        departureLoadSequence
        arrivalLoadSequence
      }
      lodgings {
        id
        name
        location {
          id
          name
        }
        startDate
        endDate
        startTime
        endTime
        startLoadSequence
        endLoadSequence
      }
      food {
        id
        name
        location {
          id
          name
        }
        date
        startTime
        endTime
        loadSequence
      }
      transports {
        id
        name
        departureLocation {
          id
          name
        }
        arrivalLocation {
          id
          name
        }
        date
        departureTime
        arrivalTime
        startLoadSequence
        endLoadSequence
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
