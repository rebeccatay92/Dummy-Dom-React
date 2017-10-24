import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createItinerary } from '../actions/itineraryActions'

class CreateItineraryForm extends Component {
  constructor () {
    super()
    this.state = {
      name: ''
    }
  }
  handleChange (e) {
    this.setState({
      name: e.target.value
    })
    console.log('name is now', this.state.name)
  }

  render () {
    return (
      <div>
        <h3>Create Itinerary Form</h3>
        <form>
          <textarea onChange={(e) => this.handleChange(e)} />
        </form>
        <button onClick={() => this.props.createItinerary(this.state.name)}>Add fake itinerary</button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createItinerary: (name) => {
      console.log('textarea', name)
      var newItinerary = {
        id: 555,
        name: name
      }
      dispatch(createItinerary(newItinerary))
    }
  }
}

export default connect(null, mapDispatchToProps)(CreateItineraryForm)
