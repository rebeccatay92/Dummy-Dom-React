import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Radium, { Style } from 'radium'
import moment from 'moment'

import { createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle } from '../../Styles/styles'

import FlightSearchParameters from '../FlightSearchParameters'
import Attachments from '../Attachments'
import SubmitCancelForm from '../SubmitCancelForm'

import { createFlight } from '../../apollo/flight'
import { queryItinerary } from '../../apollo/itinerary'

import retrieveToken from '../../helpers/cloudstorage'
import countriesToCurrencyList from '../../helpers/countriesToCurrencyList'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}flightDefaultBackground.jpg`


class CreateFlightForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ItineraryId: this.props.ItineraryId,
      departureGooglePlaceData: {},
      arrivalGooglePlaceData: {},
      name: '',
      notes: '',
      departureTerminal: '',
      arrivalTerminal: '',
      departureGate: '',
      arrivalGate: '',
      startDay: null, // POPULATED BY FLIGHT RESULTS
      endDay: null,
      startTime: null,
      endTime: null,
      boardingTime: null,
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      backgroundImage: defaultBackground
    }
  }

  handleSubmit () {
    console.log('handle submit flight')
    var bookingStatus = this.state.bookingConfirmation ? true : false

    var newFlight = {
      ItineraryId: parseInt(this.state.ItineraryId),
      departureGooglePlaceData: this.state.departureGooglePlaceData,
      arrivalGooglePlaceData: this.state.arrivalGooglePlaceData,
      name: this.state.name,
      notes: this.state.notes,
      departureTerminal: this.state.departureTerminal,
      arrivalTerminal: this.state.arrivalTerminal,
      departureGate: this.state.departureGate,
      arrivalGate: this.state.arrivalGate,
      startDay: this.state.startDay,
      endDay: this.state.endDay,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      // startLoadSequence: ???
      // endLoadSequence: ???
      boardingTime: this.state.boardingTime,
      cost: this.state.cost,
      currency: this.state.currency,
      bookingStatus: bookingStatus,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      attachments: this.state.attachments,
      backgroundImage: this.state.backgroundImage
    }

    console.log('newFlight', newFlight)
    // this.props.createFlight({
    //   variables: newFlight,
    //   refetchQueries: [{
    //     query: queryItinerary,
    //     variables: { id: this.props.ItineraryId }
    //   }]
    // })
    //
    // this.resetState()
    // this.props.toggleCreateEventType()
  }

  closeCreateFlight () {
    this.state.attachments.forEach(info => {
      var uri = info.fileName.replace('/', '%2F')
      var uriBase = process.env.REACT_APP_CLOUD_DELETE_URI
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
    this.props.toggleCreateEventType()
  }

  resetState () {
    this.setState({
      departureGooglePlaceData: {},
      arrivalGooglePlaceData: {},
      name: '',
      notes: '',
      departureTerminal: '',
      arrivalTerminal: '',
      departureGate: '',
      arrivalGate: '',
      startDay: null,
      endDay: null,
      startTime: null,
      endTime: null,
      boardingTime: null,
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      backgroundImage: defaultBackground
    })
  }

  handleFileUpload (e) {
    e.preventDefault()
    var file = e.target.files[0]
    console.log('file', file)
    if (file) {
      var ItineraryId = this.state.ItineraryId
      var timestamp = Date.now()
      var uriBase = process.env.REACT_APP_CLOUD_UPLOAD_URI
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
        return response.json()
      })
      .then(json => {
        console.log('json', json)
        if (json.name) {
          var kilobytes = json.size / 1000
          if (kilobytes >= 1000) {
            var megabytes = kilobytes / 1000
            megabytes = Math.round(megabytes * 10) / 10
            var fileSizeStr = megabytes + 'MB'
          } else {
            kilobytes = Math.round(kilobytes)
            fileSizeStr = kilobytes + 'KB'
          }
          // this.setState({attachments: this.state.attachments.concat([json.name])})
          this.setState({
            attachments: this.state.attachments.concat([
              {
                fileName: json.name,
                fileAlias: file.name,
                fileSize: fileSizeStr,
                fileType: file.type
              }
            ])
          })
        }
      })
      .catch(err => {
        console.log('err', err)
      })
    }
  }

  removeUpload (index) {
    var objectName = this.state.attachments[index].fileName
    objectName = objectName.replace('/', '%2F')
    var uriBase = process.env.REACT_APP_CLOUD_DELETE_URI
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
      var files = this.state.attachments
      var newFilesArr = (files.slice(0, index)).concat(files.slice(index + 1))

      this.setState({attachments: newFilesArr})
      this.setState({backgroundImage: defaultBackground})
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

    var currencyList = countriesToCurrencyList(this.props.countries)
    this.setState({currencyList: currencyList})
    this.setState({currency: currencyList[0]})
  }

  render () {
    return (
      <div style={createEventFormContainerStyle}>
        {/* BOX SHADOW WRAPS LEFT AND RIGHT PANEL ONLY */}
        <div style={createEventFormBoxShadow}>

          {/* LEFT PANEL --- LOCATION X 2, DATE DAY X 2, PAX, SELECTED FLIGHT */}
          <div style={createEventFormLeftPanelStyle(this.state.backgroundImage)}>
            <div style={greyTintStyle} />
            <div style={eventDescContainerStyle}>
              <FlightSearchParameters dates={this.props.dates} />
            </div>
          </div>
          {/* RESULTS PANEL(CHILD OF SEARCH PARAMS) */}

          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGS, MULTIPLE DETAILS/NOTES */}
          <div style={createEventFormRightPanelStyle}>
            <div style={bookingNotesContainerStyle}>
              <SubmitCancelForm handleSubmit={() => this.handleSubmit()} closeCreateForm={() => this.closeCreateFlight()} />
            </div>
          </div>

        </div>
        {/* BOTTOM PANEL --- ATTACHMENTS */}
        <div style={attachmentsStyle}>
          <Attachments handleFileUpload={(e) => this.handleFileUpload(e)} attachments={this.state.attachments} removeUpload={i => this.removeUpload(i)} setBackground={url => this.setBackground(url)} />
        </div>
      </div>
    )
  }
}

export default graphql(createFlight, {name: 'createFlight'})(Radium(CreateFlightForm))
