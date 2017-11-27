import { gql } from 'react-apollo'

export const createFlight = gql`
  mutation createFlight(
    $name: String!,
    $departureDay: Int!,
    $arrivalDay: Int!,
    $ItineraryId: ID!,
    $departureLoadSequence: Int!,
    $arrivalLoadSequence: Int!,
    $ItineraryId: ID!,
    $DepartureGooglePlaceData: ID!,
    $ArrivalGooglePlaceData: ID!,
    $backgroundImage: String
  ) {
    createFlight(
      name: $name,
      departureDay: $departureDay,
      arrivalDay: $arrivalDay,
      ItineraryId: $ItineraryId,
      departureLoadSequence: $departureLoadSequence,
      arrivalLoadSequence: $arrivalLoadSequence,
      DepartureGooglePlaceData: $DepartureGooglePlaceData,
      ArrivalGooglePlaceData: $ArrivalGooglePlaceData
      backgroundImage: $backgroundImage
      ) {
      id
    }
  }
`

export const updateFlight = gql`
  mutation updateFlight(
    $id: ID!,
    $name: String,
    $departureDay: Int,
    $arrivalDay: Int,
    $ItineraryId: ID,
    $departureLoadSequence: Int,
    $arrivalLoadSequence: Int,
    $ItineraryId: ID,
    $DepartureGooglePlaceData: ID,
    $ArrivalGooglePlaceData: ID
  ) {
    updateFlight(
      id: $id,
      name: $name,
      departureDay: $departureDay,
      arrivalDay: $arrivalDay,
      DepartureGooglePlaceData: $DepartureGooglePlaceData,
      ArrivalGooglePlaceData: $ArrivalGooglePlaceData,
      departureLoadSequence: $departureLoadSequence,
      arrivalLoadSequence: $arrivalLoadSequence
    ) {
      id
    }
  }
`

export const deleteFlight = gql`
  mutation deleteFlight($id: ID!) {
    deleteFlight(id: $id) {
      status
    }
  }
`
