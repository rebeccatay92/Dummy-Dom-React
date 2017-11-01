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
