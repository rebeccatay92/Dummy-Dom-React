import { gql } from 'react-apollo'

export const allCountries = gql`
  query allCountries {
    allCountries {
      id
      name
      code
    }
  }
`
