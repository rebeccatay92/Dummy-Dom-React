import React, { Component } from 'react'
import { graphql } from 'react-apollo'

// import { createActivity } from '../apollo/activity'

class CreateActivityForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ItineraryId: this.props.ItineraryId,
      date: this.props.date,
      day: this.props.day,
      loadSequence: 0,
      googlePlaceData: {},
      LocationId: 0,
      name: '',
      notes: '',
      startTime: '', // should be Int
      endTime: '', // should be Int
      cost: 0,
      currency: '',
      bookingStatus: false,
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: ''
    }
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  handleSubmit () {
    console.log(this.state)
    this.props.createActivity({
      variables: {
        ItineraryId: this.state.ItineraryId,
        date: this.state.date,
        loadSequence: 1,
        googlePlaceData: this.state.googlePlaceData,
        LocationId: this.state.LocationId,
        name: this.state.name,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        cost: this.state.cost,
        currency: this.state.currency,
        bookingStatus: this.state.bookingStatus,
        bookedThrough: this.state.bookedThrough,
        bookingConfirmation: this.state.bookingConfirmation,
        notes: this.state.notes,
        attachment: this.state.attachment
      }
    })
  }

  render () {
    return (
      <div style={{border: '2px solid black', backgroundColor: 'pink', position: 'fixed', top: '10%', left: '20%', width: '60%', height: '50%'}}>
        <div style={{width: '40%', height: '100%', display: 'inline-block', verticalAlign: 'top'}}>
          <h4>Activity</h4>
          <h4>Day {this.state.day}, {new Date(this.props.date).toDateString().toUpperCase()}</h4>
          <h4>Location: </h4>
          <label>
            Name:
            <input type='text' name='name' onChange={(e) => this.handleChange(e, 'name')} />
          </label>
          <label>
            Time
            <input type='time' name='startTime' onChange={(e) => this.handleChange(e, 'startTime')} /> to <input type='time' name='endTime' onChange={(e) => this.handleChange(e, 'endTime')} />
          </label>
        </div>
        <div style={{width: '60%', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative'}}>
          <div style={{width: '96%', position: 'absolute', left: '2%', top: '2%', bottom: '2%', background: 'white'}}>
            <h4>Booking Details</h4>
            <label>
              Booking Status
              <input type='checkbox' name='bookingStatus' onClick={() => { this.setState({bookingStatus: !this.state.bookingStatus}) }} />
            </label>
            <label>
              Booking Service
              <input type='text' name='bookedThrough' onChange={(e) => this.handleChange(e, 'bookedThrough')} />
            </label>
            <label>
              Booking Confirmation No.
              <input type='text' name='bookingConfirmation' onChange={(e) => this.handleChange(e, 'bookingConfirmation')} />
            </label>
            <label>
              Cost:
              <select name='currency' onChange={(e) => this.handleChange(e, 'currency')}>
                <option>$USD</option>
                <option>$SGD</option>
              </select>
              <input type='number' name='cost' onChange={(e) => this.handleChange(e, 'cost')} />
            </label>
            <label>
              Additional Notes
              <textarea type='text' name='notes' onChange={(e) => this.handleChange(e, 'notes')} style={{width: '200px', height: '100px', display: 'block'}} />
            </label>
            <div>
              <button onClick={() => this.handleSubmit()}>Create New Activity</button>
              <button onClick={() => this.props.toggleCreateActivityForm()}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// export default graphql(createActivity, {name: 'createActivity'})(CreateActivityForm)
export default CreateActivityForm
