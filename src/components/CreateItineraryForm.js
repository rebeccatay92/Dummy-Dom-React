import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createItinerary } from '../actions/itineraryActions'

class CreateItineraryForm extends Component {

  render () {
    return (
      <div>
        <h3>Create Itinerary Form</h3>
        <button onClick={() => this.props.createItinerary()}>Add fake itinerary</button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createItinerary: () => {
      dispatch(createItinerary())
    }
  }
}

export default connect(null, mapDispatchToProps)(CreateItineraryForm)
