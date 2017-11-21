import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Radium from 'radium'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import LocationSelection from './LocationSelection'
import { queryItinerary } from '../apollo/itinerary'
import { createActivity } from '../apollo/activity'

var countries = require('country-data').countries
// var fs = require('fs')

require('dotenv').config()

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
      name: '',
      notes: '',
      startTime: '', // should be Int
      endTime: '', // should be Int
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      fileNames: [],
      attachments: []
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
      loadSequence: this.props.highestLoadSequence + 1,
      name: this.state.name,
      currency: this.state.currency,
      cost: parseInt(this.state.cost),
      bookingStatus: bookingStatus,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      notes: this.state.notes,
      attachments: this.state.attachments
    }
    if (startUnix) newActivity.startTime = startUnix
    if (endUnix) newActivity.endTime = endUnix
    if (this.state.googlePlaceData.placeId) newActivity.googlePlaceData = this.state.googlePlaceData
    console.log('newActivity', newActivity)

    this.props.createActivity({
      variables: newActivity,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    })

    this.resetState()
    this.props.toggleCreateActivityForm()
  }

  closeCreateActivity () {
    var uriBase = ' https://www.googleapis.com/upload/storage/v1/b/domatotest/o?uploadType=media&name='
    this.state.attachments.forEach(uri => {
      fetch(uri, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ya29.c.EloKBa_BDG7OIg6_fKFXjlu8zDrr1HVW-vjM9uA54pQM8RS2FRcTRdpMltKmLyOKH3WmNMw2ty2Z76FuJjDSl-goOhpzZe-v1pZD7s8Rz2kuH9xPsIrxkbfzQL8'
        }
      })
      .then(response => {
        console.log(response)
        if (response.status === 204) {
          console.log('delete from cloud storage succeeded')
        }
      })
      .catch(err => console.log(err))
    })
    this.resetState()
    this.props.toggleCreateActivityForm()
  }

  resetState () {
    this.setState({
      startDay: this.props.startDay,
      endDay: this.props.endDay,
      startDate: (new Date(this.props.date)).toISOString().substring(0, 10),
      endDate: (new Date(this.props.date)).toISOString().substring(0, 10),
      googlePlaceData: {},
      name: '',
      notes: '',
      startTime: '', // should be Int
      endTime: '', // should be Int
      cost: 0,
      currency: this.state.currencyList[0],
      bookingStatus: false,
      bookedThrough: '',
      bookingConfirmation: '',
      fileNames: [],
      attachments: []
    })
  }

  selectLocation (location) {
    this.setState({googlePlaceData: location})
  }

  handleFileUpload (e) {
    e.preventDefault()
    var file = e.target.files[0]
    console.log('file', file)
    var ItineraryId = this.state.ItineraryId
    var timestamp = Date.now()
    // file is uploaded upon select. need to show uploading status. display list of uploaded files. button to remove upload (deletes from cloud)
    // key expires every hour. regenerate from private key. see serviceaccount.js
    var uriBase = ' https://www.googleapis.com/upload/storage/v1/b/domatotest/o?uploadType=media&name='
    var uriFull = `${uriBase}Itinerary${ItineraryId}/${file.name}_${timestamp}`
    fetch(uriFull,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ya29.c.EloKBbb-E-Yx9U54qbyEkZRsIb6Ei9CVFDj_L7ZMonb402GtnjKHgJ3TGach__4dG0xAXmvBe2RfkBoNpm10Wu6doWCTLHTkuQasNW6vu9RmDtDehCCnX0leFqg`,
          // 'Authorization': `Bearer ${process.env.CLOUDSTORAGEKEY}`,
          'Content-Type': file.type,
          'Content-Length': file.size
        },
        body: file
      }
    )
    .then(response => {
      console.log(response)
      return response.json()
    })
    .then(json => {
      // console.log('json', json)
      // console.log('selfLink', json.selfLink)
      this.setState({attachments: this.state.attachments.concat([json.selfLink])})
      this.setState({fileNames: this.state.fileNames.concat([file.name])})
    })
    .catch(err => {
      console.log('err', err)
    })
  }

  removeUpload (e) {
    var index = e.target.value
    var deleteUri = this.state.attachments[index]

    fetch(deleteUri, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ya29.c.EloKBbb-E-Yx9U54qbyEkZRsIb6Ei9CVFDj_L7ZMonb402GtnjKHgJ3TGach__4dG0xAXmvBe2RfkBoNpm10Wu6doWCTLHTkuQasNW6vu9RmDtDehCCnX0leFqg'
      }
    })
    .then(response => {
      console.log(response)
      if (response.status === 204) {
        console.log('delete from cloud storage succeeded')
      }
    })
    .then(() => {
      var attach = this.state.attachments
      var files = this.state.fileNames
      var newAttachmentsArr = (attach.slice(0, index)).concat(attach.slice(index + 1))
      var newFilesArr = (files.slice(0, index)).concat(files.slice(index + 1))

      this.setState({attachments: newAttachmentsArr})
      this.setState({fileNames: newFilesArr})
    })
    .catch(err => {
      console.log(err)
    })
  }

  preview (event, i) {
    console.log('link', this.state.attachments[i])
    fetch(this.state.attachments[i], {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ya29.c.EloKBbb-E-Yx9U54qbyEkZRsIb6Ei9CVFDj_L7ZMonb402GtnjKHgJ3TGach__4dG0xAXmvBe2RfkBoNpm10Wu6doWCTLHTkuQasNW6vu9RmDtDehCCnX0leFqg`
      }
    })
    .then(response => {
      console.log(response)
      // var streamFile = fs.createReadStream('stream.png')
      // response.body.pipe(streamFile)
      // console.log('streamFile', streamFile)
      return response.json()
    })
    .then(json => {
      console.log(json)
    })
    .catch(err => {
      console.log(err)
    })
  }

  componentDidMount () {
    var currencyList = []
    this.props.countries.forEach(e => {
      var currencyCode = countries[e.code].currencies[0]
      if (!currencyList.includes(currencyCode)) {
        currencyList.push(currencyCode)
      }
    })
    this.setState({currencyList: currencyList})
    this.setState({currency: currencyList[0]})
  }

  render () {
    return (
      <div style={{border: '2px solid black', backgroundColor: 'pink', position: 'fixed', top: '10%', left: '20%', width: '60%', height: '50%'}}>
        <div style={{width: '50%', height: '90%', display: 'inline-block', verticalAlign: 'top'}}>
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
        <div style={{width: '50%', height: '90%', display: 'inline-block', verticalAlign: 'top', position: 'relative'}}>
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
                {this.state.currencyList.map((e, i) => {
                  return <option key={i}>{e}</option>
                })}
              </select>
              <input type='number' name='cost' value={this.state.cost} onChange={(e) => this.handleChange(e, 'cost')} />
            </label>
            <label>
              Additional Notes
              <textarea type='text' name='notes' value={this.state.notes} onChange={(e) => this.handleChange(e, 'notes')} style={{width: '200px', height: '100px', display: 'block'}} />
            </label>
            <div>
              <button onClick={() => this.handleSubmit()}>Create New Activity</button>
              <button onClick={() => this.closeCreateActivity()}>Cancel</button>
            </div>
          </div>
        </div>
        <div style={{width: '100%', height: '10%', background: 'white'}}>
          <div>
            <label style={{display: 'inline-block'}}>
              Upload
              <input type='file' name='file' accept='.jpeg, .jpg, .png, .pdf' onChange={(e) => this.handleFileUpload(e)} style={{display: 'none'}} />
            </label>
            {this.state.fileNames.map((name, i) => {
              return <span key={i} onClick={(event) => this.preview(event, i)} style={{margin: '0 20px 0 20px', ':hover': {color: 'blue'}}}>{name}<button key={i} value={i} onClick={(e) => this.removeUpload(e)}>X</button></span>
            })}
            {/* <img src='stream.png' /> */}
          </div>
        </div>
      </div>
    )
  }
}

export default graphql(createActivity, {name: 'createActivity'})(Radium(CreateActivityForm))
