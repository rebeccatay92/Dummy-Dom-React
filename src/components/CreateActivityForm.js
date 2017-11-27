import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Radium, { Style } from 'radium'
// import { FormGroup, InputGroup } from 'react-bootstrap'
import moment from 'moment'

import LocationSelection from './LocationSelection'
import DateTimePicker from './DateTimePicker'
import BookingNotes from './BookingNotes'
import Attachments from './Attachments'
import SubmitCancelForm from './SubmitCancelForm'

import { createActivity } from '../apollo/activity'
import { queryItinerary } from '../apollo/itinerary'

import retrieveToken from '../helpers/cloudstorage.js'

var countries = require('country-data').countries

// const PDFJS = require('pdfjs-dist')

class CreateActivityForm extends Component {
  constructor (props) {
    super(props)
    let apiToken
    this.state = {
      ItineraryId: this.props.ItineraryId,
      startDay: this.props.day,
      endDay: this.props.day,
      googlePlaceData: {},
      name: '',
      notes: '',
      startTime: '', // if setstate, will change to unix
      endTime: '', // if setstate, will change to unix
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      fileNames: [],
      attachments: [],
      backgroundImage: ''
    }
  }

  updateDayTime (field, value) {
    console.log('field', field, 'value', value)
    this.setState({
      [field]: value
    })
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  handleSubmit () {
    var bookingStatus = this.state.bookingConfirmation ? true : false

    var newActivity = {
      ItineraryId: parseInt(this.state.ItineraryId),
      startDay: typeof (this.state.startDay) === 'number' ? this.state.startDay : parseInt(this.state.startDay),
      endDay: typeof (this.state.endDay) === 'number' ? this.state.endDay : parseInt(this.state.endDay),
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      loadSequence: this.props.highestLoadSequence + 1,
      name: this.state.name,
      currency: this.state.currency,
      cost: parseInt(this.state.cost),
      bookingStatus: bookingStatus,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      notes: this.state.notes,
      attachments: this.state.attachments,
      backgroundImage: this.state.backgroundImage
    }
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
    this.state.attachments.forEach(uri => {
      uri = uri.replace('/', '%2F')
      var uriBase = 'https://www.googleapis.com/storage/v1/b/domatodevs/o/'
      var uriFull = uriBase + uri

      fetch(uriFull, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
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
      attachments: [],
      backgroundImage: ''
    })
    this.apiToken = null
  }

  selectLocation (location) {
    this.setState({googlePlaceData: location})
  }

  handleFileUpload (e) {
    e.preventDefault()
    var file = e.target.files[0]
    console.log('file', file)
    if (file) {
      var ItineraryId = this.state.ItineraryId
      var timestamp = Date.now()
      var uriBase = ' https://www.googleapis.com/upload/storage/v1/b/domatodevs/o?uploadType=media&name='
      var uriFull = `${uriBase}Itinerary${ItineraryId}/${file.name}_${timestamp}`
      fetch(uriFull,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
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
        console.log('json', json)
        this.setState({attachments: this.state.attachments.concat([json.name])})
        this.setState({fileNames: this.state.fileNames.concat([file.name])})
      })
      .catch(err => {
        console.log('err', err)
      })
    }
  }

  removeUpload (index) {
    var objectName = this.state.attachments[index]
    objectName = objectName.replace('/', '%2F')
    var uriBase = 'https://www.googleapis.com/storage/v1/b/domatodevs/o/'
    var uriFull = uriBase + objectName

    fetch(uriFull, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`
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
      this.setState({thumbnail: false})
      this.setState({thumbnailUrl: null})
      this.setState({hoveringOver: null})
    })
    .catch(err => {
      console.log(err)
    })
  }

  setBackground (previewUrl) {
    previewUrl = previewUrl.replace(/ /gi, '%20')
    this.setState({backgroundImage: `${previewUrl}`})
  }

  componentDidMount () {
    retrieveToken()
    .then(retrieved => {
      this.apiToken = retrieved
    })

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
      <div style={{backgroundColor: 'transparent', position: 'fixed', left: 'calc(50% - 414px)', top: 'calc(50% - 283px)', width: '828px', height: '567px', zIndex: 999, color: 'white'}}>

        {/* BOX SHADOW WRAPS LEFT AND RIGHT PANEL ONLY */}
        <div style={{boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)', height: '90%'}}>

          {/* LEFT PANEL --- BACKGROUND, LOCATION, DATETIME */}
          <div style={{backgroundImage: `url(${this.state.backgroundImage})`, background: '#6D6A7A', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: '335px', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative'}}>
            <div style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, background: '#6D6A7A', opacity: '0.75'}} />
            <LocationSelection selectLocation={location => this.selectLocation(location)} />
            <input placeholder='Input Activity' type='text' name='name' value={this.state.name} onChange={(e) => this.handleChange(e, 'name')} autoComplete='off' style={{background: this.state.backgroundImage ? 'none' : 'inherit', outline: 'none', border: 'none', textAlign: 'center', fontSize: '16px', fontWeight: '300', width: '335px', position: 'relative', ':hover': { outline: '0.3px solid white' }}} />

            {/* CONTINUE PASSING DATE AND DATESARR DOWN */}
            <DateTimePicker updateDayTime={(field, value) => this.updateDayTime(field, value)} dates={this.props.dates} date={this.props.date} startDay={this.state.startDay} endDay={this.state.endDay} startTime={this.state.startTime} endTime={this.state.endTime} />
          </div>

          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGNOTES */}
          <div style={{width: '493px', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative', color: '#3c3a44'}}>
            <div style={{width: '100%', height: '100%', background: 'white', padding: '65px 2% 2% 77px'}}>
              <SubmitCancelForm handleSubmit={() => this.handleSubmit()} closeCreateForm={() => this.closeCreateActivity()} />
              <BookingNotes handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} />
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL --- ATTACHMENTS */}
        <div style={{minWidth: '20%', background: 'transparent', marginLeft: '20px', display: 'inline-block'}}>
          <Attachments handleFileUpload={(e) => this.handleFileUpload(e)} attachments={this.state.attachments} fileNames={this.state.fileNames} removeUpload={i => this.removeUpload(i)} setBackground={url => this.setBackground(url)} />
        </div>
      </div>
    )
  }
}

export default graphql(createActivity, {name: 'createActivity'})(Radium(CreateActivityForm))
