import { gql } from 'react-apollo'

export const createFlight = gql`
  mutation createFlight(
    $ItineraryId: ID!,
    $departureGooglePlaceData: googlePlaceData,
    $arrivalGooglePlaceData: googlePlaceData,
    $departureTerminal: String,
    $departureGate: String,
    $arrivalTerminal: String,
    $arrivalGate: String,
    $startLoadSequence: Int,
    $endLoadSequence: Int,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $boardingTime: Int,
    $name: String,
    $notes: String,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $attachments: [attachmentInfo],
    $backgroundImage: String
  ) {
    createFlight(
      ItineraryId: $ItineraryId,
      departureGooglePlaceData: $departureGooglePlaceData,
      arrivalGooglePlaceData: $arrivalGooglePlaceData,
      departureTerminal: $departureTerminal,
      arrivalTerminal: $arrivalTerminal,
      departureGate: $departureGate,
      arrivalGate: $arrivalGate,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      boardingTime: $boardingTime,
      name: $name,
      notes: $notes,
      cost: $cost,
      currency: $currency,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      attachments: $attachments,
      backgroundImage: $backgroundImage
      ) {
      id
    }
  }
`

export const updateFlight = gql`
  mutation updateFlight(
    $id: ID!,
    $departureGooglePlaceData: googlePlaceData,
    $arrivalGooglePlaceData: googlePlaceData,
    $startLoadSequence: Int,
    $endLoadSequence: Int,
    $departureTerminal: String,
    $departureGate: String,
    $arrivalTerminal: String,
    $arrivalGate: String,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $boardingTime: Int,
    $name: String,
    $notes: String,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $backgroundImage: String
  ) {
    updateFlight(
      id: $id,
      departureGooglePlaceData: $departureGooglePlaceData,
      arrivalGooglePlaceData: $arrivalGooglePlaceData,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      departureTerminal: $departureTerminal,
      arrivalTerminal: $arrivalTerminal,
      departureGate: $departureGate,
      arrivalGate: $arrivalGate,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      boardingTime: $boardingTime,
      name: $name,
      notes: $notes,
      cost: $cost,
      currency: $currency,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      backgroundImage: $backgroundImage
    ) {
      id
    }
  }
`

export const deleteFlight = gql`
  mutation deleteFlight($id: ID!) {
    deleteFlight(id: $id)
  }
`
