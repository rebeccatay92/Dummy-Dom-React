import React, { Component } from 'react'
import { connect } from 'react-redux'
import { deleteItinerary } from '../actions/itineraryActions'

class Itinerary extends Component {

  render () {
    var itinerary = this.props.itinerary
    return (
      <div style={{border: '1px solid black'}}>
        <h3 style={{display: 'inline-block'}}>id: {itinerary.id}</h3>
        <h3 style={{display: 'inline-block'}}>countryCode: {itinerary.countryCode}</h3>
        <h3 style={{display: 'inline-block'}}>name: {itinerary.name}</h3>
        <h3 style={{display: 'inline-block'}}>startDate: {itinerary.startDate}</h3>
        <h3 style={{display: 'inline-block'}}>endDate: {itinerary.endDate}</h3>
        <h3 style={{display: 'inline-block'}}>pax: {itinerary.pax}</h3>
        <h3 style={{display: 'inline-block'}}>travelInsurance: {itinerary.travelInsurance}</h3>
        <h3 style={{display: 'inline-block'}}>budget: {itinerary.budget}</h3>
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
