import React, { Component } from 'react'
import AirportResults from './AirportResults'
import Radium from 'radium'
import moment from 'moment'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomDatePicker from './CustomDatePicker'
import FlightMapHOC from './location/FlightMapHOC'

import { dateTimePickerContainerStyle, locationSelectionInputStyle, eventDescContainerStyle, flightMapContainerStyle } from '../Styles/styles'

import airports from '../data/airports.json'

class FlightSearchParameters extends Component {
  constructor (props) {
    super(props)
    let timeout
    this.state = {
      marginTop: 180, // styling
      departureSearch: '',
      arrivalSearch: '',
      selectingDeparture: false,
      selectingArrival: false,
      results: [], // iata airport/city results, not flights
      departureLocation: null,
      arrivalLocation: null,
      // start date, end date, start/end day
      departureDate: moment(new Date(this.props.date)),
      returnDate: moment(new Date(this.props.date)),
      startDay: null,
      // paxAdults, paxChidren, paxInfants
      classState: 'Economy',
      adultsState: 1,
      '2-11yState': 0,
      '<2yState': 0
    }
  }
  handleSubmit () {
    // HANDLE CLICK OF SEARCH BUTTON. HOIST QUERY UP TO PARENT TO REQUEST AIRHOB. RESULTS PASSED TO FLIGHTRESULTS PANEL. ONLY SELECTED FLIGHT DETAILS IS HOISTED UP TO FORM
    // console.log(moment(this.state.departureDate).format('MM/DD/YYYY'));
    const uriFull = 'https://dev-sandbox-api.airhob.com/sandboxapi/flights/v1.2/search'
    // const origin = this.state.departureLocation.type === 'airport' ? this.state.departureLocation.iata : this.state.departureLocation.cityCode
    // const destination = this.state.arrivalLocation.type === 'airport' ? this.state.arrivalLocation.iata : this.state.arrivalLocation.cityCode
    const travelDate = this.state.departureDate.format('MM/DD/YYYY')
    // console.log(origin, destination, travelDate);
    console.log('searching...');
    fetch(uriFull, {
      method: 'POST',
      headers: {
        apikey: 'f7da6320-6bda-4',
        mode: 'sandbox',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        TripType: 'O',
        NoOfAdults: this.state.adultsState,
        NoOfChilds: this.state['2-11yState'],
        NoOfInfants: this.state['<2yState'],
        ClassType: this.state.classState,
        OriginDestination: [
          {
            // 'Origin': origin,
            // 'Destination': destination,
            // 'TravelDate': travelDate
            'Origin': 'SIN',
            'Destination': 'BJS',
            'TravelDate': travelDate
          }
        ],
        Currency: 'USD',
        FlightsCount: '200ITINS'
      })
    }).then(response => {
      const json = response.json()
      console.log(json)
      return json
    }).then(results => {
      if (!results.OneWayAvailabilityResponse.ItinearyDetails.length) {
        console.log('no results')
        return
      }
      const flights = results.OneWayAvailabilityResponse.ItinearyDetails[0].Items
      // console.log(flights);
      const details = flights.map(flight => {
        return {
          cost: flight.FareDescription.PaxFareDetails[0].OtherInfo.GrossAmount,
          totalDuration: parseInt(flight.ElapsedTime),
          flights: flight.FlightDetails.map(flightDetails => {
            return {
              departureDateTime: flightDetails.DepartureDateTime,
              arrivalDateTime: flightDetails.ArrivalDateTime,
              duration: flightDetails.Duration,
              departureLocation: flightDetails.OriginAirportName,
              departureCityCountry: flightDetails.OriginAirportCity + ', ' + flightDetails.OriginAirportCountry,
              departureAirportCode: flightDetails.Origin,
              departureTerminal: flightDetails.OrgTerminal,
              arrivalLocation: flightDetails.DestinationAirportName,
              arrivalCityCountry: flightDetails.DestinationAirportCity + ', ' + flightDetails.DestinationAirportCountry,
              arrivalAirportCode: flightDetails.Destination,
              arrivalTerminal: flightDetails.DesTerminal,
              carrierCode: flightDetails.CarrierCode,
              flightNum: flightDetails.FlightNum,
              airlineName: flightDetails.AirlineName
            }
          })
        }
      })
      this.props.handleSearch(details)
    })
  }
  handleChange (e, field) {
    if (field === 'departureDate' || field === 'returnDate') {
      this.setState({
        [field]: moment(e._d)
      })
    } else {
      this.setState({
        [field]: e.target.value
      })
    }

    if (field === 'departureSearch') {
      this.setState({selectingDeparture: true})
    }
    if (field === 'arrivalSearch') {
      this.setState({selectingArrival: true})
    }
  }

  customDebounce (type) {
    // type is 'departureSearch' or 'arrivalSearch'
    var queryStr = this.state[`${type}Search`]
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.searchAirports(queryStr)
    }, 500)
  }

  searchAirports (queryStr) {
    queryStr = queryStr.trim()
    if (!queryStr.length || queryStr.length < 3) {
      this.setState({results: []})
      return
    }

    // var regexArr = queryStr.trim().split(' ')
    // console.log('params', regexArr)
    //
    // var regex = ''
    // regexArr.forEach(term => {
    //   regex += `(${term})|`
    // })
    // regex = regex.slice(0, regex.length - 1)
    // regex = new RegExp(regex, 'gi')

    // partial `[${term}]{3,}|` matches 3 chars or more?

    var regex = new RegExp(queryStr.trim(), 'gi')
    // console.log('regex', regex)

    var results = []
    airports.forEach(e => {
      // max 10 results to prevent hanging
      if (results.length > 9) return
      e.matchCount = 0
      // if (!e.city) {
      //   console.log(e)
      // }
      // if (e.country.match(regex)) {
      //   e.matchCount ++
      // }
      if (e.city && e.city.match(regex)) {
        e.matchCount ++
      }
      if (e.name.match(regex)) {
        e.matchCount ++
      }
      if (e.matchCount > 0) {
        results.push(e)
      }
    })
    results.sort(function (a, b) {
      return b.matchCount - a.matchCount
    })
    this.setState({results: results})
  }

  selectLocation (type, details) {
    // console.log('type', type, 'details', details)

    this.setState({[`${type}Location`]: details}) // set airport/city details
    this.setState({[`${type}Search`]: details.name}) // set name in input field

    this.setState({selectingDeparture: false, selectingArrival: false})
    // untoggle dropdown
    this.setState({results: []}) // clear results
  }

  handleClickOutside () {
    // HANDLE CLICKING OUT OF RESULTS, RESETS THE INPUT FIELD TO NULL OR SELECTED. RESETS RESULTS ARRAY TO EMPTY
  }

  handleDropdownSelect (e, type) {
    const types = {
      class: 'classState',
      adults: 'adultsState',
      '2-11y': '2-11yState',
      '<2y': '<2yState'
    }
    this.setState({
      [types[type]]: e.target.value
    })
  }

  componentDidMount () {
    // console.log('airports', airports)
    // console.log('dates', this.props.dates)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      marginTop: nextProps.searching ? '55' : '180'
    })
  }
  render () {
    return (
      <div style={{position: 'relative'}}>
        <div style={flightMapContainerStyle}>
          <FlightMapHOC departureLocation={this.state.departureLocation} arrivalLocation={this.state.arrivalLocation} />
        </div>

        <div style={eventDescContainerStyle}>
          <textarea key='departLocation' id='locationInput' className='left-panel-input' rows='1' autoComplete='off' placeholder='Departure City/Airport' name='departureSearch' value={this.state.departureSearch} onChange={(e) => this.handleChange(e, 'departureSearch')} onKeyUp={() => this.customDebounce('departure')} style={{...locationSelectionInputStyle(this.state.marginTop, 'flight'), ...{fontSize: '36px'}}} />
        </div>

        <p style={{textAlign: 'center'}}>to</p>

        <div style={eventDescContainerStyle}>
          <textarea key='arrivalLocation' id='locationInput' className='left-panel-input' rows='1' autoComplete='off' placeholder='Arrival City/Airport' name='arrivalSearch' value={this.state.arrivalSearch} onChange={(e) => this.handleChange(e, 'arrivalSearch')} onKeyUp={() => this.customDebounce('arrival')} style={{...locationSelectionInputStyle(this.state.marginTop, 'flight'), ...{marginTop: '0', fontSize: '36px'}}} />
        </div>
        
        {this.state.selectingDeparture &&
          <AirportResults results={this.state.results} selectLocation={(details) => this.selectLocation('departure', details)} />
        }
        {this.state.selectingArrival &&
          <AirportResults results={this.state.results} selectLocation={(details) => this.selectLocation('arrival', details)} />
        }

        {/* DATEBOX */}
        <div style={{textAlign: 'center'}}>
          <div style={{display: 'inline-block', width: '25%'}}>
            <DatePicker customInput={<CustomDatePicker flight />} selected={this.state.departureDate} dateFormat={'DD MMM YYYY'} minDate={moment(this.props.dates[0])} maxDate={moment(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'departureDate')} />
          </div>
          <div style={{display: 'inline-block', width: '25%'}}>
            <DatePicker customInput={<CustomDatePicker flight />} selected={this.state.returnDate} dateFormat={'DD MMM YYYY'} minDate={moment(this.props.dates[0])} maxDate={moment(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'returnDate')} />
          </div>
          <select value={this.state.classState} onChange={(e) => this.handleDropdownSelect(e, 'class')} style={{backgroundColor: 'transparent', marginRight: '5px'}}>
            <option style={{color: 'black'}} value='Economy'>E</option>
            <option style={{color: 'black'}} value='PremiumEconomy'>PE</option>
            <option style={{color: 'black'}} value='Business'>B</option>
            <option style={{color: 'black'}} value='First'>F</option>
          </select>
          <select value={this.state.adultsState} onChange={(e) => this.handleDropdownSelect(e, 'adults')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}}>
            {[1,2,3,4,5,6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.state['2-11yState']} onChange={(e) => this.handleDropdownSelect(e, '2-11y')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}}>
            {[0,1,2,3,4,5,6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.state['<2yState']} onChange={(e) => this.handleDropdownSelect(e, '<2y')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}}>
            {[0,1,2,3,4,5,6].map((num) => {
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
        <div style={{textAlign: 'center'}}>
          <hr style={{opacity: 0.5}} />
          {!this.props.searching && <button style={{color: 'black'}} onClick={() => this.handleSubmit()}>SEARCH</button>}
        </div>
      </div>
    )
  }
}

export default Radium(FlightSearchParameters)
