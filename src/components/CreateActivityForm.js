import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { queryItinerary } from '../apollo/itinerary'
import { createActivity } from '../apollo/activity'

class CreateActivityForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ItineraryId: this.props.ItineraryId,
      dates: this.props.dates.map(e => {
        return e.toISOString().substring(0, 10)
      }),
      date: (new Date(this.props.date)).toISOString().substring(0, 10),
      day: this.props.day,
      googlePlaceData: {},
      LocationId: 0,
      name: '',
      notes: '',
      startTime: '', // should be Int
      endTime: '', // should be Int
      cost: 0,
      currency: 'USD',
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
    var date = this.state.date / 1000 // milliseconds

    var startTimeStr = this.state.startTime
    var endTimeStr = this.state.endTime

    if (startTimeStr) {
      var startHours = startTimeStr.split(':')[0]
      var startMins = startTimeStr.split(':')[1]
      var startUnix = date + (startHours * 60 * 60) + (startMins * 60)
    }
    if (endTimeStr) {
      if (endTimeStr === '00:00') {
        endTimeStr = '24:00'
      }
      var endHours = endTimeStr.split(':')[0]
      var endMins = endTimeStr.split(':')[1]
      var endUnix = date + (endHours * 60 * 60) + (endMins * 60)
    }

    var bookingStatus = this.state.bookingConfirmation ? true : false

    var newActivity = {
      ItineraryId: parseInt(this.state.ItineraryId),
      date: date,
      // googlePlaceData: {},
      LocationId: 1, // fake locationId before api is added
      loadSequence: this.props.length + 1,
      name: this.state.name,
      currency: this.state.currency,
      cost: parseInt(this.state.cost),
      bookingStatus: bookingStatus,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      notes: this.state.notes
      // attachment: this.state.attachment
    }
    if (startUnix) newActivity.startTime = startUnix
    if (endUnix) newActivity.endTime = endUnix

    console.log('newActivity', newActivity)

    this.props.createActivity({
      variables: newActivity,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    })

    this.cancelCreateActivity()
  }

  cancelCreateActivity () {
    this.props.toggleCreateActivityForm()
    this.setState({
      date: (new Date(this.props.date)).toISOString().substring(0, 10),
      day: this.props.day,
      googlePlaceData: {},
      LocationId: 0,
      name: '',
      notes: '',
      startTime: '', // should be Int
      endTime: '', // should be Int
      cost: 0,
      currency: 'USD',
      bookingStatus: false,
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: ''
    })
  }
  render () {
    // console.log('date state', this.state.date)
    // console.log('arr', this.state.dates)
    // console.log('day', this.state.dates.indexOf(this.state.date) + 1)
    var dateInEnglish = (new Date(this.state.date)).toString().substring(0, 16)
    var day = this.state.dates.indexOf(this.state.date) + 1

    return (
      <div style={{border: '2px solid black', backgroundColor: 'pink', position: 'fixed', top: '10%', left: '20%', width: '60%', height: '50%'}}>
        <div style={{width: '40%', height: '100%', display: 'inline-block', verticalAlign: 'top'}}>
          <h4>Activity</h4>
          {/* how to link day with date input field? */}
          <h4>Day {day}, {dateInEnglish}</h4>
          <input type='date' name='date' defaultValue={this.state.date} min={this.state.dates[0]} max={this.state.dates[this.state.dates.length - 1]} onChange={(e) => this.handleChange(e, 'date')} />
          <h4>Location: </h4>
          <label>
            Name:
            <input type='text' name='name' value={this.state.name} onChange={(e) => this.handleChange(e, 'name')} />
          </label>
          <label>
            Time
            <input type='time' name='startTime' value={this.state.startTime} onChange={(e) => this.handleChange(e, 'startTime')} /> to <input type='time' name='endTime' value={this.state.endTime} onChange={(e) => this.handleChange(e, 'endTime')} />
          </label>
        </div>
        <div style={{width: '60%', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative'}}>
          <div style={{width: '96%', position: 'absolute', left: '2%', top: '2%', bottom: '2%', background: 'white'}}>
            <h4>Booking Details</h4>
            <label>
              Booking Service
              <input type='text' name='bookedThrough' value={this.state.bookedThrough} onChange={(e) => this.handleChange(e, 'bookedThrough')} />
            </label>
            <label>
              Booking Confirmation No.
              <input type='text' name='bookingConfirmation' value={this.state.bookingConfirmation} onChange={(e) => this.handleChange(e, 'bookingConfirmation')} />
            </label>
            <label>
              Cost:
              <select name='currency' value={this.state.currency} onChange={(e) => this.handleChange(e, 'currency')}>
                <option>USD</option>
                <option>SGD</option>
              </select>
              <input type='number' name='cost' value={this.state.cost} onChange={(e) => this.handleChange(e, 'cost')} />
            </label>
            <label>
              Additional Notes
              <textarea type='text' name='notes' value={this.state.notes} onChange={(e) => this.handleChange(e, 'notes')} style={{width: '200px', height: '100px', display: 'block'}} />
            </label>
            <div>
              <button onClick={() => this.handleSubmit()}>Create New Activity</button>
              <button onClick={() => this.cancelCreateActivity()}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default graphql(createActivity, {name: 'createActivity'})(CreateActivityForm)
