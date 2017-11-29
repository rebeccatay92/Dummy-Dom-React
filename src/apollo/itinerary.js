import { gql } from 'react-apollo'

export const queryItinerary = gql`
  query queryItinerary($id: ID!) {
    findItinerary(id: $id){
      id
      name
      countries {
        id
        name
        code
      }
      days
      startDate
      activities {
        id
        name
        startTime
        endTime
        location {
          id
          name
        }
        startDay
        endDay
        loadSequence
        cost
        bookedThrough
        bookingStatus
        notes
        attachments {
          id
          fileName
        }
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
        startDay
        endDay
        startTime
        endTime
        startLoadSequence
        endLoadSequence
        cost
        bookedThrough
        bookingStatus
        notes
        attachments {
          id
          fileName
        }
      }
      lodgings {
        id
        name
        location {
          id
          name
        }
        startDay
        endDay
        startTime
        endTime
        startLoadSequence
        endLoadSequence
        cost
        bookedThrough
        bookingStatus
        notes
        attachments {
          id
          fileName
        }
      }
      food {
        id
        name
        location {
          id
          name
        }
        startDay
        endDay
        startTime
        endTime
        loadSequence
        cost
        bookedThrough
        bookingStatus
        notes
        attachments {
          id
          fileName
        }
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
        startDay
        startTime
        endDay
        endTime
        startLoadSequence
        endLoadSequence
        cost
        bookedThrough
        bookingStatus
        notes
        attachments {
          id
          fileName
        }
      }
      events {
        modelId
        type
        loadSequence
        start
        day
        activity {
          id
          name
          startTime
          endTime
          location {
            id
            name
          }
          startDay
          endDay
          loadSequence
          cost
          bookedThrough
          bookingStatus
          notes
          attachments {
            id
            fileName
          }
        }
        flight {
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
          startDay
          endDay
          startTime
          endTime
          startLoadSequence
          endLoadSequence
          cost
          bookedThrough
          bookingStatus
          notes
          attachments {
            id
            fileName
          }
        }
        lodging {
          id
          name
          location {
            id
            name
          }
          startDay
          endDay
          startTime
          endTime
          startLoadSequence
          endLoadSequence
          cost
          bookedThrough
          bookingStatus
          notes
          attachments {
            id
            fileName
          }
        }
        food {
          id
          name
          location {
            id
            name
          }
          startDay
          endDay
          startTime
          endTime
          loadSequence
          cost
          bookedThrough
          bookingStatus
          notes
          attachments {
            id
            fileName
          }
        }
        transport {
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
          startDay
          startTime
          endDay
          endTime
          startLoadSequence
          endLoadSequence
          cost
          bookedThrough
          bookingStatus
          notes
          attachments {
            id
            fileName
          }
        }
      }
    }
  }`

export const allItineraries = gql`
  query allItineraries {
    allItineraries {
      id
      name
      days
      startDate
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
    }
  }`

export const itinerariesByUser = gql`
  query itinerariesByUser {
    itinerariesByUser {
      id
      name
      days
      startDate
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
    }
  }
`
// include country code. coutnryIdArr
export const createItinerary = gql`
  mutation createItinerary($UserId: Int!, $countryCode: String, $name: String!, $days: Int!, $startDate: Int, $pax: Int, $travelInsurance: String, $budget: Int) {
    createItinerary(UserId:$UserId, countryCode: $countryCode, name: $name, days: $days, startDate: $startDate, pax: $pax, travelInsurance: $travelInsurance, budget: $budget) {
      id
      name
      days
      startDate
      pax
      travelInsurance
      budget
    }
  }`

export const updateItineraryDetails = gql`
  mutation updateItineraryDetails($id: ID!, $name: String, $startDate: Int, $pax: Int, $travelInsurance: String, $budget: Int, $days: Int) {
    updateItineraryDetails(id: $id, name: $name, startDate: $startDate, pax: $pax, travelInsurance: $travelInsurance, budget: $budget, days: $days) {
      id
      name
      days
      startDate
      days
      pax
      travelInsurance
      budget
    }
  }
`
export const deleteItinerary = gql`
  mutation deleteItinerary($ItineraryId: ID!) {
    deleteItinerary(id:$ItineraryId)
  }
`
export const createCountriesItineraries = gql`
    mutation createCountriesItineraries($ItineraryId: Int!, $countryCode: String!) {
      createCountriesItineraries(ItineraryId: $ItineraryId, countryCode: $countryCode) {
        ItineraryId
        CountryId
      }
    }
  `

export const deleteCountriesItineraries = gql`
      mutation deleteCountriesItineraries($ItineraryId: Int!, $CountryId: Int!) {
        deleteCountriesItineraries(ItineraryId: $ItineraryId, CountryId: $CountryId)
      }
    `
