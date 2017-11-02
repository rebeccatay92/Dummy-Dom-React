import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

import { deleteCountriesItineraries, allItineraries } from '../apollo/itinerary'

import AddCountry from './AddCountry'

class Itinerary extends Component {
  deleteCountry (CountryId, ItineraryId) {
    console.log('country', CountryId, 'itinerary', ItineraryId)
    this.props.deleteCountriesItineraries({
      variables: {
        ItineraryId: ItineraryId,
        CountryId: CountryId
      },
      refetchQueries: [{
        query: allItineraries
      }]
    })
  }
  render () {
    var itinerary = this.props.itinerary
    return (
      <div style={{border: '1px solid black'}}>
        <div>
          <AddCountry ItineraryId={itinerary.id} />
          Countries:
          <ul>
            {itinerary.countries.map(country => {
              return <li key={country.id}>{country.id} {country.name} {country.code} <button onClick={() => this.deleteCountry(country.id, itinerary.id)}>Remove this country</button></li>
            })}
          </ul>
        </div>
        <h3 style={{display: 'inline-block'}}>id: {itinerary.id}</h3>
        <h3 style={{display: 'inline-block'}}>name: {itinerary.name}</h3>
        <h3 style={{display: 'inline-block'}}>startDate: {itinerary.startDate}</h3>
        <h3 style={{display: 'inline-block'}}>endDate: {itinerary.endDate}</h3>
        <h3 style={{display: 'inline-block'}}>pax: {itinerary.pax}</h3>
        <h3 style={{display: 'inline-block'}}>travelInsurance: {itinerary.travelInsurance}</h3>
        <h3 style={{display: 'inline-block'}}>budget: {itinerary.budget}</h3>
        <h3>Owner: {itinerary.owner.name}</h3>
        <button onClick={() => this.props.deleteItinerary(itinerary.id)}>Delete this itinerary</button>
      </div>
    )
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     deleteItinerary: (id) => {
//       dispatch(deleteItinerary(id))
//     }
//   }
// }

export default connect(null)(compose(graphql(deleteCountriesItineraries, {name: 'deleteCountriesItineraries'})(Itinerary)))
