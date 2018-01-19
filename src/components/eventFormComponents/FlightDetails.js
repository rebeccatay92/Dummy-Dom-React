import React, { Component } from 'react'
import AirportSearch from './AirportSearch'
import Radium from 'radium'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomDatePicker from './CustomDatePicker'
import airports from '../../data/airports.json'

import { eventDescContainerStyle } from '../../Styles/styles'

class FlightDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      departureLocation: null,
      arrivalLocation: null,
      departureDate: '',
      arrivalDate: '',
      flightInstances: [],
      classCode: '',
      paxAdults: 0,
      paxChildren: 0,
      paxInfants: 0
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.classCode !== nextProps.classCode) {
      this.setState({classCode: nextProps.classCode})
    }
    if (this.props.paxAdults !== nextProps.paxAdults || this.props.paxChildren !== nextProps.paxChildren || this.props.paxInfants !== nextProps.paxInfants) {
      this.setState({
        paxAdults: nextProps.paxAdults,
        paxChildren: nextProps.paxChildren,
        paxInfants: nextProps.paxInfants
      })
    }
    if (this.props.flightInstances !== nextProps.flightInstances) {
      this.setState({flightInstances: nextProps.flightInstances})
      // make departureLocation obj for AirportSearch (location is the row in airports.json). match IATA
      // which is the arrivalLocation?

      // testing with random location
      this.setState({departureLocation: {
        'id': 1,
        'name': 'Herat Airport',
        'city': 'Herat',
        'country': 'Afghanistan',
        'countryCode': 'AF',
        'iata': 'HEA',
        'latitude': 34.209999084472656,
        'longitude': 62.22829818725586,
        'timezone': 4.5
      }})
      // find departure, arrival date from start/end day
    }
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <div style={{...eventDescContainerStyle, ...{marginTop: '55px'}}}>
          <AirportSearch currentLocation={this.state.departureLocation} placeholder={'Departure City/Airport'} selectLocation={details => this.selectLocation('departure', details)} />

          <p style={{textAlign: 'center'}}>to</p>

          <AirportSearch currentLocation={this.state.arrivalLocation} placeholder={'Arrival City/Airport'} selectLocation={details => this.selectLocation('arrival', details)} />
        </div>

        {/* DATEBOX */}
        <div style={{textAlign: 'center'}}>
          {/* <div style={{display: 'inline-block', width: '25%'}}>
            <DatePicker customInput={<CustomDatePicker flight />} selected={this.state.departureDate} dateFormat={'DD MMM YYYY'} minDate={moment(this.props.dates[0])} maxDate={moment(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'departureDate')} />
          </div>
          <div style={{display: 'inline-block', width: '25%'}}>
            <DatePicker customInput={<CustomDatePicker flight />} selected={this.state.returnDate} dateFormat={'DD MMM YYYY'} minDate={moment(this.props.dates[0])} maxDate={moment(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'returnDate')} />
          </div> */}

          <select value={this.state.classCode} onChange={(e) => this.handleChange(e, 'classCode')} style={{backgroundColor: 'transparent', marginRight: '5px'}}>
            <option style={{color: 'black'}} value='Economy'>E</option>
            <option style={{color: 'black'}} value='PremiumEconomy'>PE</option>
            <option style={{color: 'black'}} value='Business'>B</option>
            <option style={{color: 'black'}} value='First'>F</option>
          </select>

          <select value={this.state.paxAdults} onChange={(e) => this.handleChange(e, 'paxAdults')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}}>
            {[1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.state.paxChildren} onChange={(e) => this.handleChange(e, 'paxChildren')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}}>
            {[0, 1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.state.paxInfants} onChange={(e) => this.handleChange(e, 'paxInfants')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}}>
            {[0, 1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
        </div>

        <div style={{marginBottom: '10px', textAlign: 'center'}}>
          <span style={{width: '25%', display: 'inline-block', textAlign: 'center'}}>Departing</span>
          <span style={{width: '25%', display: 'inline-block', textAlign: 'center'}}>Returning</span>
          <span style={{width: '10%', display: 'inline-block', textAlign: 'center', marginRight: '5px'}}>Class</span>
          <span style={{width: '10%', display: 'inline-block', textAlign: 'center', marginRight: '5px'}}>Adults</span>
          <span style={{width: '10%', display: 'inline-block', textAlign: 'center', marginRight: '5px'}}>2-11y</span>
          <span style={{width: '10%', display: 'inline-block', textAlign: 'center', marginRight: '5px'}}>{'<2y'}</span>
        </div>
      </div>
    )
  }
}

export default FlightDetails
