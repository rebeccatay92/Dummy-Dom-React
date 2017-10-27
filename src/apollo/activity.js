import { gql } from 'react-apollo'

export const createActivity = gql`
  mutation createActivity($name: String!, $date: Int!, $LocationId: ID!, $ItineraryId: ID!, $loadSequence: Int!) {
    createActivity(name: $name, date: $date, LocationId: $LocationId, ItineraryId: $ItineraryId, loadSequence: $loadSequence) {
      id
    }
  }
`

export const updateActivity = gql`
  mutation updateActivity($id: ID!, $name: String, $date: Int, $LocationId: ID, $loadSequence: Int) {
    updateActivity(id: $id, name: $name, date: $date, LocationId: $LocationId, loadSequence: $loadSequence) {
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
