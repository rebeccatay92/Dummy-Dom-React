import React, { Component } from 'react'
import AirportSearch from './eventFormComponents/AirportSearch'
import { activityIconStyle, createEventBoxStyle } from '../Styles/styles'

class IntuitiveInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      departureLocation: ''
    }
  }

  selectLocation (type, details) {
    this.setState({[`${type}Location`]: details}) // set airport/city details
  }

  render () {
    return (
      <div style={{...createEventBoxStyle, ...{width: '100%'}}}>
        <div style={{width: '33%', display: 'inline-block'}}>
          <i key='departure' className='material-icons' style={{...activityIconStyle, ...{cursor: 'default'}}}>flight_takeoff</i>
          <AirportSearch intuitiveInput currentLocation={this.state.departureLocation} placeholder={'Departure City/Airport'} selectLocation={details => this.selectLocation('departure', details)} />
        </div>
        <div style={{width: '33%', display: 'inline-block'}}>
          <i key='arrival' className='material-icons' style={{...activityIconStyle, ...{cursor: 'default'}}}>flight_land</i>
          <AirportSearch intuitiveInput currentLocation={this.state.arrivalLocation} placeholder={'Arrival City/Airport'} selectLocation={details => this.selectLocation('arrival', details)} />
        </div>
        <div style={{width: '33%', display: 'inline-block'}}>
          <i key='flightNum' className='material-icons' style={{...activityIconStyle, ...{cursor: 'default'}}}>flight</i>
          <div style={{position: 'relative'}}>
            <input style={{width: '90%'}} />
            <i key='more' onClick={() => this.props.handleCreateEventClick('Flight')} className='material-icons' style={{position: 'absolute', right: '12%', color: '#ed9fad', cursor: 'pointer'}}>more_horiz</i>
          </div>
        </div>
      </div>
    )
  }
}

export default IntuitiveInput
