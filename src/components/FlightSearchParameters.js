import React, { Component } from 'react'
import AirportResults from './AirportResults'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomDatePicker from './CustomDatePicker'
import moment from 'moment'

import { dateTimePickerContainerStyle, locationSelectionInputStyle } from '../Styles/styles'

// import airports from 'airport-codes/airports.json'
import airports from '../data/airports.json'

class FlightSearchParameters extends Component {
  constructor (props) {
    super(props)
    let timeout
    this.state = {
      marginTop: 240, // styling
      departureSearch: '',
      arrivalSearch: '',
      selectingDeparture: false,
      selectingArrival: false,
      results: [], // iata airport/city results, not flights
      departureLocation: null,
      arrivalLocation: null,
      // start date, end date, start/end day
      departureDate: null,
      startDay: null

      // pax, class
      // selected departure/arrival city/airport. what query to pass to airhob, and what props to pass to FlightResults?
    }
  }
  handleSubmit () {
    // HANDLE CLICK OF SEARCH BUTTON. HOIST QUERY UP TO PARENT TO REQUEST AIRHOB. RESULTS PASSED TO FLIGHTRESULTS PANEL. ONLY SELECTED FLIGHT DETAILS IS HOISTED UP TO FORM
  }
  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
    if (field === 'departureSearch') {
      this.setState({selectingDeparture: true})
    }
    if (field === 'arrivalSearch') {
      this.setState({selectingArrival: true})
    }
  }

  customDebounce (type) {
    // type is 'departureSearch' or 'arrivalSearch'
    var queryStr = this.state[type]
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.searchAirports(type, queryStr)
    }, 250)
  }

  searchAirports (type, queryStr) {
    queryStr = queryStr.trim()
    if (!queryStr.length) {
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
    console.log('sorted matches', results)
    this.setState({results: results})
  }

  selectLocation (type, details) {
    console.log('type', type, 'details', details)

    this.setState({[`${type}Location`]: details}) // set airport/city details
    this.setState({[`${type}Search`]: details.name}) // set name in input field

    this.setState({selectingDeparture: false, selectingArrival: false})
    // untoggle dropdown
    this.setState({results: []}) // clear results
  }

  handleClickOutside () {
    // HANDLE CLICKING OUT OF RESULTS, RESETS THE INPUT FIELD TO NULL OR SELECTED. RESETS RESULTS ARRAY TO EMPTY
  }
  componentDidMount () {
    // console.log('airports', airports)
    console.log('dates', this.props.dates)
  }
  render () {
    console.log('state', this.state)
    // DEBOUNCE CITY/AIRPORT INPUT AND RETURN IATA DATA.
    // DATE/DAY PICKER. PAX. SINGLE/RETURN
    // SEARCH BUTTON
    // AIRPORT INPUT NEED RESIZETEXTBOX
    return (
      <div style={{position: 'relative'}}>
        <form>
          <textarea id='locationInput' className='left-panel-input' rows='1' autoComplete='off' placeholder='Departure City/Airport' name='departureSearch' onChange={(e) => this.handleChange(e, 'departureSearch')} onKeyUp={() => this.customDebounce('departureSearch')} style={locationSelectionInputStyle(this.state.marginTop)} value={this.state.departureSearch} />
          <textarea id='locationInput' className='left-panel-input' rows='1' autoComplete='off' placeholder='Arrival City/Airport' name='arrivalSearch' onChange={(e) => this.handleChange(e, 'arrivalSearch')} onKeyUp={() => this.customDebounce('arrivalSearch')} style={locationSelectionInputStyle(this.state.marginTop)} value={this.state.arrivalSearch} />
        </form>

        {/* PROBABLY SHOULD COMBINE LOL */}
        {this.state.selectingDeparture &&
          <AirportResults results={this.state.results} selectAirport={(details) => this.selectLocation('departure', details)} />
        }
        {this.state.selectingArrival &&
          <AirportResults results={this.state.results} selectAirport={(details) => this.selectLocation('arrival', details)} />
        }

        {/* WHY CANNOT SEE DATEBOX T.T */}
        <div style={dateTimePickerContainerStyle}>
          <DatePicker customInput={<CustomDatePicker />} dateFormat={'ddd DD MMM YYYY'} minDate={moment(this.props.dates[0])} maxDate={moment(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'departureDate')} />
        </div>
      </div>
    )
  }
}

export default FlightSearchParameters
