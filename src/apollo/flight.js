import { gql } from 'react-apollo'

export const createFlightBooking = gql`
  mutation createFlightBooking(
    $ItineraryId: ID!,
    $paxAdults: Int,
    $paxChildren: Int,
    $paxInfants: Int,
    $cost: Int,
    $currency: String,
    $classCode: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,,
    $backgroundImage: String
    $attachments: [attachmentInput],
    $flightInstances: [createFlightInstanceInput]
  ) {
    createFlightBooking(
      ItineraryId: $ItineraryId,
      paxAdults: $paxAdults,
      paxChildren: $paxChildren,
      paxInfants: $paxInfants,
      cost: $cost,
      currency: $currency,
      classCode: $classCode,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      backgroundImage: $backgroundImage,
      attachments: $attachments,
      flightInstances: $flightInstances
      ) {
      id
    }
  }
`

// UPDATE FLIGHT NOT YET DONE
export const updateFlightBooking = gql`
  mutation updateFlightBooking(
    $id: ID!,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $backgroundImage: String
  ) {
    updateFlightBooking(
      id: $id,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      backgroundImage: $backgroundImage
    ) {
      id
    }
  }
`

export const deleteFlightBooking = gql`
  mutation deleteFlightBooking($id: ID!) {
    deleteFlightBooking(id: $id)
  }
`
