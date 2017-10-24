import React, { Component } from 'react'
import { connect } from 'react-redux'
import Itinerary from './Itinerary'

class ItineraryPage extends Component {
  render () {
    return (
      <div>
        {this.props.itineraries.map(itinerary => {
          return (
            <Itinerary />
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
