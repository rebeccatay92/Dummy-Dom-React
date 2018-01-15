import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'

import { createItinerary, itinerariesByUser } from '../../apollo/itinerary'
import { allCountries } from '../../apollo/country'

class CreateItineraryForm extends Component {
  constructor () {
    super()
    this.state = {
      name: '',
      CountryId: null,
      days: 0,
      startDate: '',
      endDate: ''
      // pax: 0,
      // travelInsurance: '',
      // budget: 0
    }
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    var newItinerary = {}
    Object.keys(this.state).forEach(key => {
      if (key !== 'startDate' && key !== 'endDate') {
        newItinerary[key] = this.state[key]
      }
    })

    if (this.state.startDate) {
      var startDate = new Date(this.state.startDate)
      var startUnix = startDate.getTime() / 1000
      newItinerary.startDate = startUnix
    }
    if (this.state.endDate) {
      var endDate = new Date(this.state.endDate)
      var endUnix = endDate.getTime() / 1000
      newItinerary.endDate = endUnix
    }
    newItinerary.UserId = 1
    this.props.createItinerary({
      variables: newItinerary,
      refetchQueries: [{
        query: itinerariesByUser
      }]
    })
    this.setState({
      name: '',
      CountryId: null,
      days: 0,
      startDate: '',
      endDate: '',
      pax: 0,
      travelInsurance: '',
      budget: 0
    })
  }

  render () {
    // if (this.props.data.allCountries) {
    //   console.log('allCountries', this.props.data.allCountries)
    // }
    return (
      <div style={{border: '1px solid black'}}>
        <h3>Create Itinerary Form</h3>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <label>
            Country
            <select name='CountryId' value={this.state.countryCode} onChange={(e) => this.handleChange(e, 'CountryId')}>
              <option value=''>Select a country</option>
              {this.props.data.allCountries && this.props.data.allCountries.map((country, i) => {
                return <option value={country.id} key={`country${i}`}>{country.name}</option>
              })}
            </select>
          </label>
          <label>
            Name of this itinerary
            <input type='text' name='name' value={this.state.name} onChange={(e) => this.handleChange(e, 'name')} />
          </label>
          <label>
            Number of days
            <input type='number' name='days' onChange={(e) => this.handleChange(e, 'days')} />
          </label>
          <label>
            Start Date
            <input type='date' name='startDate' value={this.state.startDate} onChange={(e) => this.handleChange(e, 'startDate')} />
          </label>
          <label>
            End Date
            <input type='date' name='endDate' value={this.state.endDate} onChange={(e) => this.handleChange(e, 'endDate')} />
          </label>
          {/* <label>
            Pax
            <input type='number' name='pax' value={this.state.pax} onChange={(e) => this.handleChange(e, 'pax')} />
          </label>
          <label>
            Travel Insurance
            <input type='text' name='travelInsurance' value={this.state.travelInsurance} onChange={(e) => this.handleChange(e, 'travelInsurance')} />
          </label>
          <label>
            Budget
            <input type='number' name='budget' value={this.state.budget} onChange={(e) => this.handleChange(e, 'budget')} />
          </label> */}
          <button type='submit'>Add itinerary with apollo</button>
        </form>
      </div>
    )
  }
}

export default compose(
  graphql(allCountries),
  graphql(createItinerary, {name: 'createItinerary'})
)(CreateItineraryForm)
