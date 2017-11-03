import { gql } from 'react-apollo'

export const createActivity = gql`
  mutation createActivity(
    $name: String!,
    $date: Int!,
    $googlePlaceData: googlePlaceData!,
    $ItineraryId: ID!,
    $loadSequence: Int!
  ) {
    createActivity(
      name: $name,
      date: $date,
      googlePlaceData: $googlePlaceData,
      ItineraryId: $ItineraryId,
      loadSequence: $loadSequence
    ) {
      id
    }
  }
`

export const updateActivity = gql`
  mutation updateActivity(
    $id: ID!,
    $name: String,
    $date: Int,
    $googlePlaceData: googlePlaceData,
    $loadSequence: Int
  ) {
    updateActivity(
      id: $id,
      name: $name,
      date: $date,
      googlePlaceData: $googlePlaceData,
      loadSequence: $loadSequence
    ) {
      id
    }
  }
`

export const deleteActivity = gql`
  mutation deleteActivity($id: ID!) {
    deleteActivity(id: $id) {
      status
    }
  }
`

export const createFlight = gql`
  mutation createFlight(
    $name: String!,
    $departureDate: Int!,
    $arrivalDate: Int!,
    $ItineraryId: ID!,
    $departureLoadSequence: Int!,
    $arrivalLoadSequence: Int!,
    $ItineraryId: ID!,
    $DepartureGooglePlaceData: ID!,
    $ArrivalGooglePlaceData: ID!
  ) {
    createFlight(
      name: $name,
      departureDate: $departureDate,
      arrivalDate: $arrivalDate,
      ItineraryId: $ItineraryId,
      departureLoadSequence: $departureLoadSequence,
      arrivalLoadSequence: $arrivalLoadSequence,
      DepartureGooglePlaceData: $DepartureGooglePlaceData,
      ArrivalGooglePlaceData: $ArrivalGooglePlaceData) {
      id
    }
  }
`

export const updateFlight = gql`
  mutation updateFlight(
    $id: ID!,
    $name: String,
    $arrivalDate: Int,
    $departureDate: Int,
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
      arrivalDate: $arrivalDate,
      departureDate: $departureDate,
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

export const createLodging = gql`
  mutation createLodging(
    $name: String!,
    $startDate: Int!,
    $endDate: Int!,
    $googlePlaceData: ID!,
    $ItineraryId: ID!,
    $startloadSequence: Int!,
    $endLoadSequence: Int!
  ) {
    createLodging(
      name: $name,
      startDate: $startDate,
      endDate: $endDate,
      googlePlaceData: $googlePlaceData,
      ItineraryId: $ItineraryId,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence
    ) {
      id
    }
  }
`

export const updateLodging = gql`
  mutation updateLodging(
    $id: ID!,
    $name: String,
    $startDate: Int,
    $endDate: Int,
    $googlePlaceData: ID,
    $startLoadSequence: Int,
    $endLoadSequence: Int
  ) {
    updateLodging(
      id: $id,
      name: $name,
      startDate: $startDate,
      endDate: $endDate,
      googlePlaceData: $googlePlaceData,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence
    ) {
      id
    }
  }
`

export const deleteLodging = gql`
  mutation deleteLodging($id: ID!) {
    deleteLodging(id: $id) {
      status
    }
  }
`

export const createFood = gql`
  mutation createFood(
    $name: String!,
    $date: Int!,
    $googlePlaceData: ID!,
    $ItineraryId: ID!,
    $loadSequence: Int!
  ) {
    createFood(
      name: $name,
      date: $date,
      googlePlaceData: $googlePlaceData,
      ItineraryId: $ItineraryId,
      loadSequence: $loadSequence
    ) {
      id
    }
  }
`

export const updateFood = gql`
  mutation updateFood(
    $id: ID!,
    $name: String,
    $date: Int,
    $googlePlaceData: ID,
    $loadSequence: Int
  ) {
    updateFood(
      id: $id,
      name: $name,
      date: $date,
      googlePlaceData: $googlePlaceData,
      loadSequence: $loadSequence
    ) {
      id
    }
  }
`

export const deleteFood = gql`
  mutation deleteFood($id: ID!) {
    deleteFood(id: $id) {
      status
    }
  }
`

export const createTransport = gql`
  mutation createTransport(
    $name: String!,
    $date: Int!,
    $DepartureGooglePlaceData: ID!,
    $ArrivalGooglePlaceData: ID!,
    $ItineraryId: ID!,
    $departureLoadSequence: Int!,
    $arrivalLoadSequence: Int!
  ) {
    createTransport(
      name: $name,
      date: $date,
      DepartureGooglePlaceData: $DepartureGooglePlaceData,
      ArrivalGooglePlaceData: $ArrivalGooglePlaceData,
      ItineraryId: $ItineraryId,
      departureLoadSequence: $departureLoadSequence,
      arrivalLoadSequence: $arrivalLoadSequence
    ) {
      id
    }
  }
`

export const updateTransport = gql`
  mutation updateTransport(
    $id: ID!,
    $name: String,
    $date: Int,
    $DepartureGooglePlaceData: ID,
    $ArrivalGooglePlaceData: ID,
    $departureLoadSequence: Int,
    $arrivalLoadSequence: Int
  ) {
    updateTransport(
      id: $id,
      name: $name,
      date: $date,
      DepartureGooglePlaceData: $DepartureGooglePlaceData,
      ArrivalGooglePlaceData: $ArrivalGooglePlaceData,
      departureLoadSequence: $departureLoadSequence,
      arrivalLoadSequence: $arrivalLoadSequence
    ) {
      id
    }
  }
`

export const deleteTransport = gql`
  mutation deleteTransport($id: ID!) {
    deleteTransport(id: $id) {
      status
    }
  }
`

export const changingLoadSequence = gql`
  mutation changingLoadSequence($input: [LoadSequence]) {
    changingLoadSequence(input: $input)
  }
`
