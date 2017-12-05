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
    $locationAlias: String,
    $name: String,
    $currency: String,
    $cost: Int,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $notes: String,
    $attachments: [attachmentInfo],
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
      locationAlias: $locationAlias
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
    $startDay: Int!,
    $endDay: Int!,
    $startTime: Int,
    $endTime: Int,
    $googlePlaceData: googlePlaceData,
    $locationAlias: String,
    $name: String,
    $currency: String,
    $cost: Int,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $notes: String,
    $backgroundImage: String
  ) {
    updateActivity(
      id: $id,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      googlePlaceData: $googlePlaceData,
      locationAlias: $locationAlias
      name: $name,
      currency: $currency,
      cost: $cost,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      notes: $notes,
      backgroundImage: $backgroundImage
    ) {
      id
    }
  }
`

export const deleteActivity = gql`
  mutation deleteActivity($id: ID!) {
    deleteActivity(id: $id)
  }
`
