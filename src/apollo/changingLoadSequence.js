import { gql } from 'react-apollo'

export const changingLoadSequence = gql`
  mutation changingLoadSequence(
    $input: [LoadSequence]
  ) {
    changingLoadSequence(input: $input)
  }
`
