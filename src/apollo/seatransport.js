import { gql } from 'react-apollo'

export const createSeaTransport = gql`
  mutation createSeaTransport(
    $ItineraryId: ID!,
    $departureGooglePlaceData: googlePlaceData,
    $arrivalGooglePlaceData: googlePlaceData,
    $departureLocationAlias: String,
    $arrivalLocationAlias: String,
    $startLoadSequence: Int,
    $endLoadSequence: Int,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $notes: String,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $attachments: [attachmentInput],
    $backgroundImage: String
  ) {
    createSeaTransport(
      ItineraryId: $ItineraryId,
      departureGooglePlaceData: $departureGooglePlaceData,
      arrivalGooglePlaceData: $arrivalGooglePlaceData,
      departureLocationAlias: $departureLocationAlias,
      arrivalLocationAlias: $arrivalLocationAlias,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
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

export const updateSeaTransport = gql`
  mutation updateSeaTransport(
    $id: ID!,
    $departureGooglePlaceData: googlePlaceData,
    $arrivalGooglePlaceData: googlePlaceData,
    $departureLocationAlias: String,
    $arrivalLocationAlias: String,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $startLoadSequence: Int,
    $endLoadSequence: Int,
    $notes: String,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $backgroundImage: String,
    $addAttachments: [attachmentInput],
    $removeAttachments: [ID]
  ) {
    updateSeaTransport(
      id: $id,
      departureGooglePlaceData: $departureGooglePlaceData,
      arrivalGooglePlaceData: $arrivalGooglePlaceData,
      departureLocationAlias: $departureLocationAlias,
      arrivalLocationAlias: $arrivalLocationAlias,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      notes: $notes,
      cost: $cost,
      currency: $currency,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      backgroundImage: $backgroundImage,
      addAttachments: $addAttachments,
      removeAttachments: $removeAttachments
    ) {
      id
    }
  }
`

export const deleteSeaTransport = gql`
  mutation deleteSeaTransport($id: ID!) {
    deleteSeaTransport(id: $id)
  }
`
