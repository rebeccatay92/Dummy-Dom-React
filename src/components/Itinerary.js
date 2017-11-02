import React, { Component } from 'react'
import { connect } from 'react-redux'
import { deleteItinerary } from '../actions/itineraryActions'

class Itinerary extends Component {

  handleSubmit(e) {
    e.preventDefault()
    console.log(e.target.value)
  }

  render () {
    var itinerary = this.props.itinerary
    return (
      <div style={{border: '1px solid black'}}>
        <div>
          <form>
            <input type='text' name='countryCode' />
            <button type='submit' onClick={(e) => this.handleSubmit(e)}>Add country (testing with countryCode)</button>
          </form>
          Countries:
          <ul>
            {itinerary.countries.map(country => {
              return <li key={country.id}>{country.id} {country.name} {country.code}</li>
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

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItinerary: (id) => {
      dispatch(deleteItinerary(id))
    }
  }
}

export default connect(null, mapDispatchToProps)(Itinerary)
