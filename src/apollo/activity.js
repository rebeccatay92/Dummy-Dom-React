import { gql } from 'react-apollo'

export const createActivity = gql`
  mutation createActivity(
    $ItineraryId: ID!,
    $loadSequence: Int
    $day: Int!,
    $startTime: Int,
    $endTime: Int,
    $googlePlaceData: googlePlaceData,
    $LocationId: ID,
    $name: String,
    $currency: String,
    $cost: Int,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $notes: String
  ) {
    createActivity(
      ItineraryId: $ItineraryId,
      loadSequence: $loadSequence,
      day: $day,
      startTime: $startTime,
      endTime: $endTime,
      googlePlaceData: $googlePlaceData,
      LocationId: $LocationId,
      name: $name,
      currency: $currency,
      cost: $cost,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      notes: $notes
    ) {
      id
    }
  }
`

export const updateActivity = gql`
  mutation updateActivity(
    $id: ID!,
    $name: String,
    $day: Int,
    $googlePlaceData: googlePlaceData,
    $loadSequence: Int
  ) {
    updateActivity(
      id: $id,
      name: $name,
      day: $day,
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
    $departureDay: Int!,
    $arrivalDay: Int!,
    $ItineraryId: ID!,
    $departureLoadSequence: Int!,
    $arrivalLoadSequence: Int!,
    $ItineraryId: ID!,
    $DepartureGooglePlaceData: ID!,
    $ArrivalGooglePlaceData: ID!
  ) {
    createFlight(
      name: $name,
      departureDay: $departureDay,
      arrivalDay: $arrivalDay,
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
    $arrivalDay: Int,
    $departureDay: Int,
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
      arrivalDay: $arrivalDay,
      departureDay: $departureDay,
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
    $startDay: Int!,
    $endDay: Int!,
    $googlePlaceData: ID!,
    $ItineraryId: ID!,
    $startloadSequence: Int!,
    $endLoadSequence: Int!
  ) {
    createLodging(
      name: $name,
      startDay: $startDay,
      endDay: $endDay,
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
    $startDay: Int,
    $endDay: Int,
    $googlePlaceData: ID,
    $startLoadSequence: Int,
    $endLoadSequence: Int
  ) {
    updateLodging(
      id: $id,
      name: $name,
      startDay: $startDay,
      endDay: $endDay,
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
    $day: Int!,
    $googlePlaceData: ID!,
    $ItineraryId: ID!,
    $loadSequence: Int!
  ) {
    createFood(
      name: $name,
      day: $day,
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
    $day: Int,
    $googlePlaceData: ID,
    $loadSequence: Int
  ) {
    updateFood(
      id: $id,
      name: $name,
      day: $day,
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
    $day: Int!,
    $DepartureGooglePlaceData: ID!,
    $ArrivalGooglePlaceData: ID!,
    $ItineraryId: ID!,
    $departureLoadSequence: Int!,
    $arrivalLoadSequence: Int!
  ) {
    createTransport(
      name: $name,
      day: $day,
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
    $day: Int,
    $DepartureGooglePlaceData: ID,
    $ArrivalGooglePlaceData: ID,
    $departureLoadSequence: Int,
    $arrivalLoadSequence: Int
  ) {
    updateTransport(
      id: $id,
      name: $name,
      day: $day,
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
