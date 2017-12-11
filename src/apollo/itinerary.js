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
      events {
        modelId
        type
        loadSequence
        start
        day
        Activity {
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
          currency
          cost
          bookedThrough
          bookingConfirmation
          bookingStatus
          notes
          attachments {
            id
            fileName
            fileAlias
            fileType
            fileSize
          }
          backgroundImage
        }
        Flight {
          FlightInstance {
            id
            FlightBookingId
            flightNumber
            airlineCode
            airlineName
            departureLocation {
              id
              name
            }
            arrivalLocation {
              id
              name
            }
            departureTerminal
            arrivalTerminal
            departureGate
            arrivalGate
            startDate
            endDate
            startDay
            endDay
            startTime
            endTime
            startLoadSequence
            endLoadSequence
            notes
          }
          FlightBooking {
            id
            ItineraryId
            paxAdults
            paxChildren
            paxInfants
            cost
            currency
            classCode
            bookingStatus
            bookedThrough
            bookingConfirmation
            backgroundImage
            attachments {
              id
              fileName
              fileAlias
              fileType
              fileSize
            }
          }
        }
        Lodging {
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
          currency
          cost
          bookedThrough
          bookingConfirmation
          bookingStatus
          notes
          attachments {
            id
            fileName
            fileAlias
            fileType
            fileSize
          }
          backgroundImage
        }
        Food {
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
          currency
          cost
          bookedThrough
          bookingConfirmation
          bookingStatus
          notes
          type
          attachments {
            id
            fileName
            fileAlias
            fileType
            fileSize
          }
          backgroundImage
        }
        Transport {
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
          currency
          cost
          bookedThrough
          bookingConfirmation
          bookingStatus
          notes
          attachments {
            id
            fileName
            fileAlias
            fileType
            fileSize
          }
          backgroundImage
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
  }`

export const createItinerary = gql`
  mutation createItinerary(
    $UserId: ID!,
    $CountryId: ID,
    $name: String!,
    $days: Int!,
    $startDate: Int,
    $pax: Int,
    $travelInsurance: String,
    $budget: Int
  ) {
    createItinerary(
      UserId:$UserId,
      CountryId: $CountryId,
      name: $name,
      days: $days,
      startDate: $startDate,
      pax: $pax,
      travelInsurance: $travelInsurance,
      budget: $budget
    ) {
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
  mutation updateItineraryDetails(
    $id: ID!,
    $name: String,
    $startDate: Int,
    $pax: Int,
    $travelInsurance: String,
    $budget: Int,
    $days: Int
  ) {
    updateItineraryDetails(
      id: $id,
      name: $name,
      startDate: $startDate,
      pax: $pax,
      travelInsurance: $travelInsurance,
      budget: $budget,
      days: $days
    ) {
      id
      name
      days
      startDate
      days
      pax
      travelInsurance
      budget
    }
  }`

export const deleteItinerary = gql`
  mutation deleteItinerary($id: ID!) {
    deleteItinerary(id: $id)
  }`

export const createCountriesItineraries = gql`
  mutation createCountriesItineraries(
    $ItineraryId: Int!,
    $countryCode: String!
  ) {
    createCountriesItineraries(
      ItineraryId: $ItineraryId,
      countryCode: $countryCode
    ) {
      ItineraryId
      CountryId
    }
  }`

export const deleteCountriesItineraries = gql`
    mutation deleteCountriesItineraries(
      $ItineraryId: Int!,
      $CountryId: Int!
    ) {
      deleteCountriesItineraries(
        ItineraryId: $ItineraryId,
        CountryId: $CountryId
      )
    }`
