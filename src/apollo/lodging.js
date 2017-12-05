import { gql } from 'react-apollo'

export const createLodging = gql`
  mutation createLodging(
    $ItineraryId: ID!,
    $googlePlaceData: googlePlaceData,
    $LocationId: ID,
    $startLoadSequence: Int,
    $endLoadSequence:Int,
    $name: String,
    $notes: String,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $roomType: String,
    $attachments: [attachmentInfo],
    $backgroundImage: String
  ) {
    createLodging(
      ItineraryId: $ItineraryId,
      googlePlaceData: $googlePlaceData,
      LocationId: $LocationId,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      name: $name,
      notes: $notes,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      cost: $cost,
      currency: $currency,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      roomType: $roomType,
      attachments: $attachments,
      backgroundImage: $backgroundImage
    ) {
      id
    }
  }
`

export const updateLodging = gql`
  mutation updateLodging(
    $id: ID!,
    $googlePlaceData: googlePlaceData,
    $name: String,
    $notes: String,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $roomType: String,
    $backgroundImage: String
  ) {
    updateLodging(
      id: $id,
      googlePlaceData: $googlePlaceData,
      name: $name,
      notes: $notes,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      cost: $cost,
      currency: $currency,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      roomType: $roomType,
      backgroundImage: $backgroundImage
    ) {
      id
    }
  }
`

export const deleteLodging = gql`
  mutation deleteLodging($id: ID!) {
    deleteLodging(id: $id)
  }
`
