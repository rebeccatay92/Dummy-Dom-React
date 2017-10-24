import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createItinerary } from '../actions/itineraryActions'

class CreateItineraryForm extends Component {
  constructor () {
    super()
    this.state = {
      name: '',
      countryId: null,
      startDate: null,
      endDate: null,
      pax: null,
      travelInsurance: '',
      budget: null
    }
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  render () {
    return (
      <div>
        <h3>Create Itinerary Form</h3>
        <form>
          <label>
            Country
            <input type='number' name='countryId' onChange={(e) => this.handleChange(e, 'countryId')} />
          </label>
          <label>
            Name of this itinerary
            <input type='text' name='name' onChange={(e) => this.handleChange(e, 'name')} />
          </label>
          <label>
            Start Date
            <input type='date' name='startDate' onChange={(e) => this.handleChange(e, 'startDate')} />
          </label>
          <label>
            End Date
            <input type='date' name='endDate' onChange={(e) => this.handleChange(e, 'endDate')} />
          </label>
          <label>
            Pax
            <input type='number' name='pax' onChange={(e) => this.handleChange(e, 'pax')} />
          </label>
          <label>
            Travel Insurance
            <input type='text' name='travelInsurance' onChange={(e) => this.handleChange(e, 'travelInsurance')} />
          </label>
          <label>
            Budget
            <input type='number' name='budget' onChange={(e) => this.handleChange(e, 'budget')} />
          </label>
        </form>
        <button onClick={() => this.props.createItinerary(this.state)}>Add fake itinerary</button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createItinerary: (form) => {
      console.log('textarea', form.name)
      var newItinerary = {
        id: 555,
        name: form.name,
        countryId: form.countryId
      }
      dispatch(createItinerary(newItinerary))
    }
  }
}

export default connect(null, mapDispatchToProps)(CreateItineraryForm)
