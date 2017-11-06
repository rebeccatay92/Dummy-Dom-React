import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { Link } from 'react-router-dom'

import { deleteItinerary, deleteCountriesItineraries, allItineraries } from '../apollo/itinerary'

import AddCountry from './AddCountry'
import UpdateItineraryDetails from './UpdateItineraryDetails'

class Itinerary extends Component {
  constructor (props) {
    super(props)
    this.state = {
      updating: false
    }
  }
  deleteCountry (CountryId, ItineraryId) {
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

  toggleUpdateForm () {
    this.setState({updating: !this.state.updating})
  }

  deleteItinerary (ItineraryId) {
    this.props.deleteItinerary({
      variables: {
        ItineraryId: ItineraryId
      },
      refetchQueries: [{
        query: allItineraries
      }]
    })
  }

  render () {
    var itinerary = this.props.itinerary
    var url = '/planner/' + itinerary.id
    var startDate = (new Date(itinerary.startDate * 1000).toISOString()).substring(0, 10)
    var endDate = (new Date(itinerary.endDate * 1000).toISOString()).substring(0, 10)
    return (
      <div style={{border: '1px solid black'}}>
        <Link to={url}>Plan your itinerary</Link>
        <h3>Owner: {itinerary.owner.name}</h3>
        <h3 style={{display: 'inline-block'}}>ItineraryId: {itinerary.id}</h3>
        <div>
          <AddCountry ItineraryId={itinerary.id} />
          Countries:
          <ul>
            {itinerary.countries.map(country => {
              return <li key={country.id}>{country.id} {country.name} {country.code} <button onClick={() => this.deleteCountry(country.id, itinerary.id)}>Remove this country</button></li>
            })}
          </ul>
        </div>
        <h3>name: {itinerary.name}</h3>
        <h3 style={{display: 'inline-block'}}>startDate: {startDate}</h3>
        <h3 style={{display: 'inline-block'}}>endDate: {endDate}</h3>
        <h3 style={{display: 'inline-block'}}>pax: {itinerary.pax}</h3>
        <h3 style={{display: 'inline-block'}}>travelInsurance: {itinerary.travelInsurance}</h3>
        <h3 style={{display: 'inline-block'}}>budget: {itinerary.budget}</h3>

        <button onClick={() => this.toggleUpdateForm()}>Toggle update form</button>
        <div hidden={!this.state.updating}>
          <UpdateItineraryDetails itinerary={itinerary} toggleUpdateForm={() => this.toggleUpdateForm()} />
        </div>
        <button onClick={() => this.deleteItinerary(itinerary.id)}>Delete this itinerary</button>
      </div>
    )
  }
}

export default compose(
  graphql(deleteCountriesItineraries, {name: 'deleteCountriesItineraries'}),
  graphql(deleteItinerary, {name: 'deleteItinerary'})
)(Itinerary)
