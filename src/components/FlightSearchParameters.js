import React, { Component } from 'react'
import { locationSelectionInputStyle, locationDropdownStyle } from '../Styles/styles'

import airports from 'airport-codes/airports.json'

class FlightSearchParameters extends Component {
  constructor (props) {
    super(props)
    let timeout
    let airportData
    this.state = {
      marginTop: 240, // styling
      departureSearch: '',
      arrivalSearch: '',
      selectingDeparture: false,
      selectingArrival: false,
      results: [], // iata airport/city results, not flights
      pax: null
      // start date, end date, start/end day
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

  customDepartureDebounce () {
    var queryStr = this.state.departureSearch
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.searchAirports(queryStr)
    }, 250)
  }
  customArrivalDebounce () {
    var queryStr = this.state.arrivalSearch
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.searchAirports(queryStr)
    }, 250)
  }
  searchAirports () {
    // need to handle both departure/arrival
    console.log('queryStr', this.state.departureSearch)
    this.setState({results: [1, 2, 3, 4, 5]})
  }
  handleClickOutside () {
    // HANDLE CLICKING OUT OF RESULTS, RESETS THE INPUT FIELD TO NULL OR SELECTED
  }
  componentDidMount () {
    // console.log('airports', airports)
    this.airportData = airports.filter(row => row.iata !== '')
    console.log('airportData', this.airportData)

  }
  render () {
    // DEBOUNCE CITY/AIRPORT INPUT AND RETURN IATA DATA.
    // DATE/DAY PICKER. PAX. SINGLE/RETURN
    // SEARCH BUTTON
    return (
      <div style={{position: 'relative'}}>
        <form>
          <textarea id='locationInput' className='left-panel-input' rows='1' autoComplete='off' placeholder='Departure City/Airport' name='departureSearch' onChange={(e) => this.handleChange(e, 'departureSearch')} onKeyUp={() => this.customDepartureDebounce()} style={locationSelectionInputStyle(this.state.marginTop)} value={this.state.departureSearch} />
          <textarea id='locationInput' className='left-panel-input' rows='1' autoComplete='off' placeholder='Arrival City/Airport' name='arrivalSearch' onChange={(e) => this.handleChange(e, 'arrivalSearch')} onKeyUp={() => this.customArrivalDebounce()} style={locationSelectionInputStyle(this.state.marginTop)} value={this.state.arrivalSearch} />
          {/* <i className='material-icons'>place</i> */}
        </form>

        {this.state.selectingDeparture &&
        <div>
          {/* CHANGE DROPDOWN STYLE TO FIT DEPARTURE/ARRIVAL */}
          {this.state.results.map((indiv, i) => {
            // return <GooglePlaceResult result={indiv} selectLocation={(location) => this.selectLocation(location)} key={i} />
            return <span style={{display: 'block'}} key={'airport'+i}>Airport results</span>
             // REPLACE WITH MAPPED AIRPORT RESULTS
          })}
        </div>
        }
      </div>
    )
  }
}

export default FlightSearchParameters
