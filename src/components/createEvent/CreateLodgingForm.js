import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import Radium from 'radium'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'

import { createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle } from '../../Styles/styles'

import LocationSelection from '../location/LocationSelection'
import DateTimePicker from '../eventFormComponents/DateTimePicker'
import BookingDetails from '../eventFormComponents/BookingDetails'
import LocationAlias from '../eventFormComponents/LocationAlias'
import Notes from '../eventFormComponents/Notes'
import Attachments from '../eventFormComponents/Attachments'
import SubmitCancelForm from '../eventFormComponents/SubmitCancelForm'

import { createLodging } from '../../apollo/lodging'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary } from '../../apollo/itinerary'

import { retrieveToken, removeAllAttachments } from '../../helpers/cloudStorage'
import countriesToCurrencyList from '../../helpers/countriesToCurrencyList'
import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}lodgingDefaultBackground.jpg`

class CreateLodgingForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ItineraryId: this.props.ItineraryId,
      startDay: this.props.day,
      endDay: this.props.day,
      googlePlaceData: {},
      locationAlias: '',
      description: '',
      notes: '',
      startTime: null, // if setstate, will change to unix
      endTime: null, // if setstate, will change to unix
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      backgroundImage: defaultBackground
    }
  }

  updateDayTime (field, value) {
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

    var newLodging = {
      ItineraryId: parseInt(this.state.ItineraryId),
      locationAlias: this.state.locationAlias,
      startDay: typeof (this.state.startDay) === 'number' ? this.state.startDay : parseInt(this.state.startDay),
      endDay: typeof (this.state.endDay) === 'number' ? this.state.endDay : parseInt(this.state.endDay),
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      // loadSequence: this.props.highestLoadSequence + 1,
      description: this.state.description,
      currency: this.state.currency,
      cost: parseInt(this.state.cost),
      bookingStatus: bookingStatus,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      notes: this.state.notes,
      attachments: this.state.attachments,
      backgroundImage: this.state.backgroundImage
    }
    if (this.state.googlePlaceData.placeId) {
      newLodging.googlePlaceData = this.state.googlePlaceData
    }

    var helperOutput = newEventLoadSeqAssignment(this.props.events, 'Lodging', newLodging)
    console.log('helper output', helperOutput)

    newLodging = helperOutput.newEvent
    // console.log('newLodging', newLodging)

    this.props.changingLoadSequence({
      variables: {
        input: helperOutput.loadSequenceInput
      }
    })

    this.props.createLodging({
      variables: newLodging,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    })

    this.resetState()
    this.props.toggleCreateEventType()
  }

  closeCreateLodging () {
    removeAllAttachments(this.state.attachments, this.apiToken)
    this.resetState()
    this.props.toggleCreateEventType()
  }

  resetState () {
    this.setState({
      startDay: this.props.startDay,
      endDay: this.props.endDay,
      googlePlaceData: {},
      locationAlias: '',
      description: '',
      notes: '',
      startTime: null, // should be Int
      endTime: null, // should be Int
      cost: 0,
      currency: this.state.currencyList[0],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      backgroundImage: defaultBackground
    })
    this.apiToken = null
  }

  selectLocation (location) {
    this.setState({googlePlaceData: location})
    console.log('selected location', location)
  }

  handleFileUpload (attachmentInfo) {
    this.setState({attachments: this.state.attachments.concat([attachmentInfo])})
  }

  removeUpload (index) {
    var files = this.state.attachments
    var newFilesArr = (files.slice(0, index)).concat(files.slice(index + 1))

    this.setState({attachments: newFilesArr})
    this.setState({backgroundImage: defaultBackground})
  }

  setBackground (previewUrl) {
    previewUrl = previewUrl.replace(/ /gi, '%20')
    this.setState({backgroundImage: `${previewUrl}`})
  }

  componentDidMount () {
    this.props.retrieveCloudStorageToken()

    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })

    var currencyList = countriesToCurrencyList(this.props.countries)
    this.setState({currencyList: currencyList})
    this.setState({currency: currencyList[0]})
  }

  render () {
    return (
      <div style={createEventFormContainerStyle}>

        {/* BOX SHADOW WRAPS LEFT AND RIGHT PANEL ONLY */}
        <div style={createEventFormBoxShadow}>

          {/* LEFT PANEL --- BACKGROUND, LOCATION, DATETIME */}
          <div style={createEventFormLeftPanelStyle(this.state.backgroundImage)}>
            <div style={greyTintStyle} />
            <div style={{...eventDescContainerStyle, ...{marginTop: '240px'}}}>
              <LocationSelection selectLocation={location => this.selectLocation(location)} currentLocation={this.state.googlePlaceData} />
            </div>
            <div style={eventDescContainerStyle}>
              <input className='left-panel-input' placeholder='Input Description' type='text' name='description' value={this.state.description} onChange={(e) => this.handleChange(e, 'description')} autoComplete='off' style={eventDescriptionStyle(this.state.backgroundImage)} />
            </div>
            {/* CONTINUE PASSING DATE AND DATESARR DOWN */}
            <DateTimePicker updateDayTime={(field, value) => this.updateDayTime(field, value)} dates={this.props.dates} date={this.props.date} startDay={this.state.startDay} endDay={this.state.endDay} startTime={this.state.startTime} endTime={this.state.endTime} />
          </div>

          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGNOTES */}
          <div style={createEventFormRightPanelStyle()}>
            <div style={bookingNotesContainerStyle}>
              <SubmitCancelForm handleSubmit={() => this.handleSubmit()} closeCreateForm={() => this.closeCreateLodging()} />
              <h4 style={{fontSize: '24px'}}>Booking Details</h4>
              <BookingDetails handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} />
              <h4 style={{fontSize: '24px', marginTop: '50px'}}>
                  Additional Notes
              </h4>
              <LocationAlias handleChange={(e, field) => this.handleChange(e, field)} />
              <Notes handleChange={(e, field) => this.handleChange(e, field)} />
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL --- ATTACHMENTS */}
        <div style={attachmentsStyle}>
          <Attachments handleFileUpload={(e) => this.handleFileUpload(e)} attachments={this.state.attachments} ItineraryId={this.state.ItineraryId} removeUpload={i => this.removeUpload(i)} setBackground={url => this.setBackground(url)} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.plannerActivities,
    cloudStorageToken: state.cloudStorageToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    retrieveCloudStorageToken: () => {
      dispatch(retrieveCloudStorageToken())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(createLodging, {name: 'createLodging'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'})
)(Radium(CreateLodgingForm)))
