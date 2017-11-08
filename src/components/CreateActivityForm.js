import React, { Component } from 'react'

class CreateActivityForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ItineraryId: this.props.ItineraryId,
      day: this.props.day,
      name: '',
      notes: '',
      startTime: '', // should be Int
      endTime: '', // should be Int
      cost: 0,
      currency: '',
      bookingStatus: '',
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: ''
    }
  }
  render () {
    return (
      <div style={{border: '2px solid black', backgroundColor: 'pink', position: 'fixed', top: '10%', left: '20%', width: '60%', height: '50%'}}>
        <div style={{width: '40%', height: '100%', display: 'inline-block', verticalAlign: 'top'}}>
          <h4>Activity</h4>
          <h4>Location </h4>
          <h4>Name: __________</h4>
          <h4>Day: {this.state.day}</h4>
          <span><input type='time' /> to <input type='time' /></span>
        </div>
        <div style={{width: '60%', height: '100%', background: 'grey', display: 'inline-block', verticalAlign: 'top'}}>
          <h4>Booking Details</h4>
          <h4>Booking service</h4>
          <h4>Booking confirmation number</h4>
          <h4>Cost</h4>
          <h4>Notes</h4>
          <h4>Space for notesss</h4>
        </div>
      </div>
    )
  }
}

export default CreateActivityForm
