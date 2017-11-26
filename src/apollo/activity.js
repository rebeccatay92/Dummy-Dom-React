import { gql } from 'react-apollo'

export const createActivity = gql`
  mutation createActivity(
    $ItineraryId: ID!,
    $loadSequence: Int
    $startDay: Int!,
    $endDay: Int!,
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
    $notes: String,
    $attachments: [String],
    $backgroundImage: String
  ) {
    createActivity(
      ItineraryId: $ItineraryId,
      loadSequence: $loadSequence,
      startDay: $startDay,
      endDay: $endDay,
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
      notes: $notes,
      attachments: $attachments,
      backgroundImage: $backgroundImage
    ) {
      id
    }
  }
`

export const updateActivity = gql`
  mutation updateActivity(
    $id: ID!,
    $name: String,
    $startDay: Int,
    $endDay: Int,
    $googlePlaceData: googlePlaceData,
    $loadSequence: Int
  ) {
    updateActivity(
      id: $id,
      name: $name,
      startDay: $startDay,
      endDay: $endDay,
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
