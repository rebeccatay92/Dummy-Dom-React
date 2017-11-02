import React, { Component } from 'react'
import { graphql } from 'react-apollo'

class UpdateItineraryDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: this.props.itinerary.name,
      startDate: this.props.itinerary.startDate,
      endDate: this.props.itinerary.endDate,
      pax: this.props.itinerary.pax,
      travelInsurance: this.props.itinerary.travelInsurance,
      budget: this.props.itinerary.budget
    }
  }
  render () {
    return (
      <div>
        <h3>update itinerary form</h3>
        <form onSubmit={(e) => this.updateItineraryDetails(e)}>
          <label>
            Name:
            <input type='text' defaultValue={this.state.name} />
          </label>
          <label>
            startDate:
            <input type='text' defaultValue={this.state.startDate} />
          </label>
          <label>
            endDate:
            <input type='text' defaultValue={this.state.endDate} />
          </label>
          <label>
            pax:
            <input type='number' defaultValue={this.state.pax} />
          </label>
          <label>
            travelInsurance:
            <input type='text' defaultValue={this.state.travelInsurance} />
          </label>
          <label>
            budget:
            <input type='number' defaultValue={this.state.budget} />
          </label>
          <button type='submit'>Submit changes</button>
        </form>
      </div>
    )
  }
}

export default UpdateItineraryDetails
