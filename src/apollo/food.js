import { gql } from 'react-apollo'

export const createFood = gql`
  mutation createFood(
    $name: String!,
    $startDay: Int!,
    $endDay: Int!,
    $googlePlaceData: ID!,
    $ItineraryId: ID!,
    $loadSequence: Int!
  ) {
    createFood(
      name: $name,
      startDay: $startDay,
      endDay: $endDay,
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
    $startDay: Int,
    $endDay: Int,
    $googlePlaceData: ID,
    $loadSequence: Int
  ) {
    updateFood(
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

export const deleteFood = gql`
  mutation deleteFood($id: ID!) {
    deleteFood(id: $id) {
      status
    }
  }
`
