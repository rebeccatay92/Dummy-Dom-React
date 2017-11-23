import { gql } from 'react-apollo'

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
