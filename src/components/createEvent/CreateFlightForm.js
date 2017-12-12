import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Radium, { Style } from 'radium'
import moment from 'moment'

import { createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle } from '../../Styles/styles'

import FlightSearchParameters from '../FlightSearchParameters'
import FlightSearchResults from '../FlightSearchResults'
import Attachments from '../Attachments'
import SubmitCancelForm from '../SubmitCancelForm'

import { createFlightBooking } from '../../apollo/flight'
import { queryItinerary } from '../../apollo/itinerary'

import retrieveToken from '../../helpers/cloudstorage'
import countriesToCurrencyList from '../../helpers/countriesToCurrencyList'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}flightDefaultBackground.jpg`


class CreateFlightForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currencyList: [], // not submitted
      ItineraryId: this.props.ItineraryId,
      paxAdults: null,
      paxChildren: null,
      paxInfants: null,
      cost: 0,
      currency: '',
      classCode: '',
      bookedThrough: '',
      bookingConfirmation: '',
      backgroundImage: defaultBackground,
      attachments: [],
      // ARR OF ATTACHMENT INPUT
      // input attachmentInput {
      //   fileName: String
      //   fileAlias: String
      //   fileType: String
      //   fileSize: String
      // }
      flightInstances: [],
      // ARR OF FLIGHTINSTANCE INPUT
      // input flightInstanceInput {
      //   flightNumber: Int
      //   airlineCode: String
      //   airlineName: String
      //   departureIATA: String
      //   arrivalIATA: String
      //   departureTerminal: String
      //   arrivalTerminal: String
      //   departureGate: String
      //   arrivalGate: String
      //   startDate: Int
      //   endDate: Int
      //   startDay: Int
      //   endDay: Int
      //   startTime: Int
      //   endTime: Int
      //   startLoadSequence: Int
      //   endLoadSequence: Int
      //   notes: String
      // }
      flights: [],
      searching: false
    }
  }

  handleSearch (flights) {
    this.setState({
      flights,
      searching: true
    })
    console.log(this.state)
  }

  handleSubmit () {
    console.log('handle submit flight')
    // NEEDS TESTING AGAINST CREATEFLIGHTBOOKING MUTATION

    var bookingStatus = this.state.bookingConfirmation ? true : false

    var newFlight = {
      ItineraryId: parseInt(this.state.ItineraryId),
      paxAdults: this.state.paxAdults,
      paxChildren: this.state.paxChildren,
      paxInfants: this.state.paxInfants,
      cost: this.state.cost,
      currency: this.state.currency,
      classCode: this.state.classCode,
      bookingStatus: bookingStatus,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      backgroundImage: this.state.backgroundImage,
      attachments: this.state.attachments,
      flightInstances: this.state.flightInstances
    }

    console.log('newFlight', newFlight)

    // this.props.createFlightBooking({
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
      paxAdults: null,
      paxChildren: null,
      paxInfants: null,
      cost: 0,
      currency: '',
      classCode: '',
      bookedThrough: '',
      bookingConfirmation: '',
      backgroundImage: defaultBackground,
      attachments: [],
      flightInstances: []
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
          <div style={createEventFormLeftPanelStyle(this.state.backgroundImage, 'flight')}>
            <div style={greyTintStyle} />
            <div style={eventDescContainerStyle}>
              <FlightSearchParameters dates={this.props.dates} date={this.props.date} handleSearch={(flights) => this.handleSearch(flights)} />
            </div>
          </div>
          {/* RESULTS PANEL(CHILD OF SEARCH PARAMS) */}

          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGS, MULTIPLE DETAILS/NOTES */}
          <div style={createEventFormRightPanelStyle('flight')}>
            <div style={bookingNotesContainerStyle}>
              <SubmitCancelForm handleSubmit={() => this.handleSubmit()} closeCreateForm={() => this.closeCreateFlight()} />
              <div style={{width: '100%', height: '91%', margin: '3% 0 6% 0', overflowY: 'auto'}}>
                <FlightSearchResults flights={this.state.flights} searching={this.state.searching} />
              </div>
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

export default graphql(createFlightBooking, {name: 'createFlightBooking'})(Radium(CreateFlightForm))
