import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import moment from 'moment'
import Radium from 'radium'
import LocationSearch from '../location/LocationSearch'

import countriesToCurrencyList from '../../helpers/countriesToCurrencyList'
import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'
import { activityIconStyle, createEventBoxStyle, intuitiveDropdownStyle } from '../../Styles/styles'

import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary, updateItineraryDetails } from '../../apollo/itinerary'

class IntuitiveActivityInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      location: '',
      search: '',
      searching: false
    }
  }

  handleKeydown (e) {
    if (e.keyCode === 13) {
      this.handleSubmit()
    }
  }

  resetState () {
    this.setState({
      departureLocation: '',
      arrivalLocation: '',
      search: '',
      showFlights: false,
      flights: [],
      flightInstances: []
    })
  }

  selectLocation (location) {
    if (location.openingHours) {
      location.openingHours = JSON.stringify(location.openingHours)
    }
    this.setState({googlePlaceData: location})
    console.log('selected location', location)
  }

  componentDidMount () {
    const currencyList = countriesToCurrencyList(this.props.countries)
    this.setState({currency: currencyList[0]})
  }

  render () {
    return (
      <div onKeyDown={(e) => this.handleKeydown(e)} tabIndex='0' style={{...createEventBoxStyle, ...{width: '100%', paddingBottom: '10px', top: '-1.5vh'}}}>
        <div style={{display: 'inline-block', width: '35%'}}>
          <i key='departure' className='material-icons' style={{...activityIconStyle, ...{cursor: 'default'}}}>directions_run</i>
          <div>
            <input type='text' placeholder='Description' style={{width: '90%'}} />
          </div>
        </div>
        <div style={{display: 'inline-block', width: '35%'}}>
          <i key='departure' className='material-icons' style={{...activityIconStyle, ...{cursor: 'default'}}}>place</i>
          <LocationSearch intuitiveInput selectLocation={location => this.selectLocation(location)} placeholder={'Location'} currentLocation={this.state.googlePlaceData} />
        </div>
        <div style={{display: 'inline-block', width: '30%'}}>
          <i key='departure' className='material-icons' style={{...activityIconStyle, ...{cursor: 'default'}}}>watch_later</i>
          <div style={{position: 'relative'}}>
            <i key='more' onClick={() => this.props.handleCreateEventClick('Activity')} className='material-icons' style={{position: 'absolute', right: '14%', color: '#ed9fad', cursor: 'pointer'}}>more_horiz</i>
            <input type='time' style={{width: '40%'}} />
            <span>{' '}to{' '}</span>
            <input type='time' style={{width: '40%'}} />
          </div>
        </div>
        <div style={{marginTop: '5px'}}>
          <button onClick={() => this.handleSubmit()} style={{marginRight: '5px', backgroundColor: 'white', border: '1px solid #9FACBC'}}>Submit</button>
          <button onClick={() => this.props.toggleIntuitiveInput()} style={{backgroundColor: 'white', border: '1px solid #9FACBC'}}>Cancel</button>
        </div>
      </div>
    )
  }
}

export default IntuitiveActivityInput
