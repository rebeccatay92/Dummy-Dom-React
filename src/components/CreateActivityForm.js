import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Radium from 'radium'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import LocationSelection from './LocationSelection'
import { queryItinerary } from '../apollo/itinerary'
import { createActivity } from '../apollo/activity'

class CreateActivityForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ItineraryId: this.props.ItineraryId,
      dates: this.props.dates.map(e => {
        return moment(e).unix()
      }),
      date: (new Date(this.props.date)).toISOString().substring(0, 10),
      startDay: this.props.day,
      endDay: this.props.day,
      startDate: moment(new Date(this.props.date)),
      endDate: moment(new Date(this.props.date)),
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
    if (field !== 'startDate' && field !== 'endDate') {
      this.setState({
        [field]: e.target.value
      })
    }

    if (field === 'startDay' || field === 'endDay') {
      var newUnix = this.state.dates[e.target.value - 1]
      var newDate = moment.unix(newUnix)

      if (field === 'startDay') {
        this.setState({startDate: newDate})
        if (e.target.value > this.state.endDay) {
          this.setState({endDay: e.target.value})
          this.setState({endDate: newDate})
        }
      }
      if (field === 'endDay') {
        this.setState({endDate: newDate})
      }
    }

    if (field === 'startDate' || field === 'endDate') {
      // set the new start/end date
      this.setState({
        [field]: moment(e._d)
      })

      var selectedUnix = moment(e._d).unix()
      var newDay = this.state.dates.indexOf(selectedUnix) + 1

      if (field === 'startDate') {
        this.setState({startDay: newDay})
        if (selectedUnix > this.state.endDate.unix()) {
          this.setState({endDate: moment(e._d)})
          this.setState({endDay: newDay})
        }

      } else if (field === 'endDate') {
        this.setState({endDay: newDay})
      }
    }
  }

  handleSubmit () {
    // time is relative to 1970 1st jan
    var startTimeStr = this.state.startTime
    var endTimeStr = this.state.endTime

    if (startTimeStr) {
      var startHours = startTimeStr.split(':')[0]
      var startMins = startTimeStr.split(':')[1]
      var startUnix = (startHours * 60 * 60) + (startMins * 60)
    }
    if (endTimeStr) {
      if (endTimeStr === '00:00') {
        endTimeStr = '24:00'
      }
      var endHours = endTimeStr.split(':')[0]
      var endMins = endTimeStr.split(':')[1]
      var endUnix = (endHours * 60 * 60) + (endMins * 60)
    }

    var bookingStatus = this.state.bookingConfirmation ? true : false

    var newActivity = {
      ItineraryId: parseInt(this.state.ItineraryId),
      startDay: typeof (this.state.startDay) === 'number' ? this.state.startDay : parseInt(this.state.startDay),
      endDay: typeof (this.state.endDay) === 'number' ? this.state.endDay : parseInt(this.state.endDay),
      googlePlaceData: this.state.googlePlaceData,
      // LocationId: 1, // fake locationId before api is added
      // loadSequence: this.props.length + 1,
      loadSequence: this.props.highestLoadSequence + 1,
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
      startDay: this.props.startDay,
      endDay: this.props.endDay,
      startDate: (new Date(this.props.date)).toISOString().substring(0, 10),
      endDate: (new Date(this.props.date)).toISOString().substring(0, 10),
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

  selectLocation (location) {
    this.setState({googlePlaceData: location})
  }

  render () {
    return (
      <div style={{border: '2px solid black', backgroundColor: 'pink', position: 'fixed', top: '10%', left: '20%', width: '60%', height: '50%'}}>
        <div style={{width: '50%', height: '100%', display: 'inline-block', verticalAlign: 'top'}}>
          <h4>Activity</h4>
          <label>
            Name:
            <input type='text' name='name' value={this.state.name} onChange={(e) => this.handleChange(e, 'name')} autoComplete='off' style={{background: 'pink', outline: 'none', border: 'none', borderBottom: '1px solid pink', ':hover': {borderBottom: '1px solid black'}}} />
          </label>
          <label>
            Location:
            <LocationSelection selectLocation={location => this.selectLocation(location)} />
          </label>
{/*
          <h5>Location: {this.state.googlePlaceData.name}</h5>
          <h5>Address: {this.state.googlePlaceData.address}</h5> */}

          <select name='startDay' onChange={(e) => this.handleChange(e, 'startDay')} value={this.state.startDay} style={{background: 'pink', border: 'none'}}>
            {this.state.dates.map((indiv, i) => {
              return <option value={i + 1} key={i}>Day {i + 1}</option>
            })}
          </select>
          <DatePicker selected={this.state.startDate} dateFormat={'ddd, MMM DD YYYY'} minDate={moment.unix(this.state.dates[0])} maxDate={moment.unix(this.state.dates[this.state.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'startDate')} />

          <div>
            <input type='time' name='startTime' value={this.state.startTime} onChange={(e) => this.handleChange(e, 'startTime')} /> <span>to</span>
            <input type='time' name='endTime' value={this.state.endTime} onChange={(e) => this.handleChange(e, 'endTime')} />
          </div>

          <select name='endDay' onChange={(e) => this.handleChange(e, 'endDay')} value={this.state.endDay} style={{background: 'pink', border: 'none'}}>
            {this.state.dates.map((indiv, i) => {
              if (i + 1 >= this.state.startDay) {
                return <option value={i + 1} key={i}>Day {i + 1}</option>
              }
            })}
          </select>
          <DatePicker selected={this.state.endDate} dateFormat={'ddd, MMM DD YYYY'} minDate={this.state.startDate} maxDate={moment.unix(this.state.dates[this.state.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'endDate')} />

        </div>
        <div style={{width: '50%', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative'}}>
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

export default graphql(createActivity, {name: 'createActivity'})(Radium(CreateActivityForm))
