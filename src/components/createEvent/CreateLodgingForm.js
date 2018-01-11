import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import Radium from 'radium'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'

import { createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle } from '../../Styles/styles'

import SingleLocationSelection from '../location/SingleLocationSelection'
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
import { countriesToCurrencyList, allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'
import latestTime from '../../helpers/latestTime'
import moment from 'moment'
import { constructGooglePlaceDataObj, constructLocationDetails } from '../../helpers/location'
import newEventTimelineValidation from '../../helpers/newEventTimelineValidation'

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
      defaultTime: null,
      startTime: null, // if setstate, will change to unix
      endTime: null, // if setstate, will change to unix
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      backgroundImage: defaultBackground,
      googlePlaceDetails: null,
      locationDetails: {
        address: null,
        telephone: null,
        openingHours: null
      }
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
      startDay: this.state.startDay,
      endDay: this.state.endDay,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
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

    // VALIDATE START AND END TIMES
    if (typeof (newLodging.startTime) !== 'number' || typeof (newLodging.endTime) !== 'number') {
      console.log('time is missing')
      return
    }

    // VALIDATE PLANNER TIMINGS
    var output = newEventTimelineValidation(this.props.events, 'Lodging', newLodging)
    console.log('output', output)
    if (!output.isValid) {
      window.alert(`time ${newLodging.startTime} // ${newLodging.endTime} clashes with pre existing events.`)
      console.log('ERROR ROWS', output.errorRows)
    }

    var helperOutput = newEventLoadSeqAssignment(this.props.events, 'Lodging', newLodging)
    console.log('helper output', helperOutput)

    newLodging = helperOutput.newEvent
    console.log('newLodging', newLodging)

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
      backgroundImage: defaultBackground,
      googlePlaceDetails: null
    })
    this.apiToken = null
  }

  selectLocation (place) {
    var googlePlaceData = constructGooglePlaceDataObj(place)
    this.setState({googlePlaceData: googlePlaceData})
    this.setState({googlePlaceDetails: place})
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

    // var currencyList = countriesToCurrencyList(this.props.countries)
    // this.setState({currencyList: currencyList})
    // this.setState({currency: currencyList[0]})

    var currencyList = allCurrenciesList()
    this.setState({currencyList: currencyList})
    this.setState({currency: currencyList[0]})

    var defaultUnix = latestTime(this.props.events, this.props.day)
    var defaultTime = moment.utc(defaultUnix * 1000).format('HH:mm')
    this.setState({defaultTime: defaultTime})
    this.setState({startTime: defaultUnix, endTime: defaultUnix})
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.googlePlaceDetails) {
      if (prevState.googlePlaceDetails !== this.state.googlePlaceDetails || prevState.startDay !== this.state.startDay) {
        var locationDetails = constructLocationDetails(this.state.googlePlaceDetails, this.props.dates, this.state.startDay)
        this.setState({locationDetails: locationDetails})
      }
    }
    // if location/day/time changed, validate opening hours
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
              <SingleLocationSelection selectLocation={place => this.selectLocation(place)} currentLocation={this.state.googlePlaceData} locationDetails={this.state.locationDetails} />
            </div>
            <div style={eventDescContainerStyle}>
              <input className='left-panel-input' placeholder='Input Description' type='text' name='description' value={this.state.description} onChange={(e) => this.handleChange(e, 'description')} autoComplete='off' style={eventDescriptionStyle(this.state.backgroundImage)} />
            </div>
            {/* CONTINUE PASSING DATE AND DATESARR DOWN */}
            <DateTimePicker updateDayTime={(field, value) => this.updateDayTime(field, value)} dates={this.props.dates} date={this.props.date} startDay={this.state.startDay} endDay={this.state.endDay} defaultTime={this.state.defaultTime} />
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
              <LocationAlias handleChange={(e) => this.handleChange(e, 'locationAlias')} />
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
