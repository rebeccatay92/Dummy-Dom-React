import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreateItineraryForm from './CreateItineraryForm'
import Itinerary from './Itinerary'

class ItineraryPage extends Component {
  render () {
    return (
      <div>
        <h1>ITINERARY PAGE</h1>
        <CreateItineraryForm />
        {this.props.itineraries.map(itinerary => {
          return (
            <Itinerary itinerary={itinerary} key={itinerary.id} />
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    itineraries: state.itineraryList
  }
}

export default connect(mapStateToProps)(ItineraryPage)
