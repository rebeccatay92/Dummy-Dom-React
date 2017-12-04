import { gql } from 'react-apollo'

export const createTransport = gql`
  mutation createTransport(
    $ItineraryId: ID!,
    $departureGooglePlaceData: googlePlaceData,
    $arrivalGooglePlaceData: googlePlaceData,
    $startLoadSequence: Int,
    $endLoadSequence: Int,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $name: String,
    $notes: String,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $type: String,
    $attachments: [attachmentInfo],
    $backgroundImage: String
  ) {
    createTransport(
      ItineraryId: $ItineraryId,
      departureGooglePlaceData: $departureGooglePlaceData,
      arrivalGooglePlaceData: $arrivalGooglePlaceData,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      name: $name,
      notes: $notes,
      cost: $cost,
      currency: $currency,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      type: $type,
      attachments: $attachments,
      backgroundImage: $backgroundImage
    ) {
      id
    }
  }
`

export const updateTransport = gql`
  mutation updateTransport(
    $id: ID!,
    $departureGooglePlaceData: googlePlaceData,
    $arrivalGooglePlaceData: googlePlaceData,
    $startLoadSequence: Int,
    $endLoadSequence: Int,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $name: String,
    $notes: String,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $type: String,
    $backgroundImage: String
  ) {
    updateTransport(
      id: $id,
      departureGooglePlaceData: $departureGooglePlaceData,
      arrivalGooglePlaceData: $arrivalGooglePlaceData,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      name: $name,
      notes: $notes,
      cost: $cost,
      currency: $currency,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      type: $type,
      backgroundImage: $backgroundImage
    ) {
      id
    }
  }
`

export const deleteTransport = gql`
  mutation deleteTransport($id: ID!) {
    deleteTransport(id: $id)
  }
`
