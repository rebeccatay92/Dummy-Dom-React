import { gql } from 'react-apollo'

export const createFood = gql`
  mutation createFood(
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
    $notes: String,
    $type: String,
    $currency: String,
    $cost: Int,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $attachments: [attachmentInfo],
    $backgroundImage: String
  ) {
    createFood(
      ItineraryId: $ItineraryId,
      loadSequence: $loadSequence,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      googlePlaceData: $googlePlaceData,
      LocationId: $LocationId,
      locationAlias: $locationAlias,
      name: $name,
      notes: $notes,
      type: $type,
      currency: $currency,
      cost: $cost,
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

export const updateFood = gql`
  mutation updateFood(
    $id: ID!,
    $startDay: Int!,
    $endDay: Int!,
    $startTime: Int,
    $endTime: Int,
    $googlePlaceData: googlePlaceData,
    $locationAlias: String,
    $name: String,
    $notes: String,
    $type: String,
    $currency: String,
    $cost: Int,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $backgroundImage: String
  ) {
    updateFood(
      id: $id,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      googlePlaceData: $googlePlaceData,
      locationAlias: $locationAlias,
      name: $name,
      notes: $notes,
      type: $type,
      currency: $currency,
      cost: $cost,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      backgroundImage: $backgroundImage
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
