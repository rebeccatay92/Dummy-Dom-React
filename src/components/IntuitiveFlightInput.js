import React, { Component } from 'react'
import AirportSearch from './eventFormComponents/AirportSearch'
import moment from 'moment'
import { activityIconStyle, createEventBoxStyle, intuitiveDropdownStyle } from '../Styles/styles'

class IntuitiveFlightInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      departureLocation: '',
      arrivalLocation: '',
      showFlights: false,
      flights: [],
      tripType: '',
      paxAdults: '',
      paxChildren: '',
      paxInfants: '',
      classCode: '',
      search: ''
    }
  }

  selectLocation (type, details) {
    this.setState({[`${type}Location`]: details}, () => {
      if (this.state.departureLocation && this.state.arrivalLocation) {
        this.handleFlightSearch()
        this.setState({
          showFlights: true
        })
      }
    })
  }

  handleFlightSearch () {
    // console.log(moment(this.state.departureDate).format('MM/DD/YYYY'));
    const uriFull = 'https://dev-sandbox-api.airhob.com/sandboxapi/flights/v1.2/search'
    const origin = this.state.departureLocation.type === 'airport' ? this.state.departureLocation.iata : this.state.departureLocation.cityCode
    const destination = this.state.arrivalLocation.type === 'airport' ? this.state.arrivalLocation.iata : this.state.arrivalLocation.cityCode
    const travelDate = moment(new Date(this.props.departureDate)).format('MM/DD/YYYY')
    console.log('searching...')
    fetch(uriFull, {
      method: 'POST',
      headers: {
        apikey: 'f7da6320-6bda-4',
        mode: 'sandbox',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        TripType: 'O',
        NoOfAdults: 1,
        NoOfChilds: 0,
        NoOfInfants: 0,
        ClassType: 'Economy',
        OriginDestination: [
          {
            'Origin': origin,
            'Destination': destination,
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
          totalDuration: parseInt(flight.ElapsedTime[0]),
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
              airlineName: flightDetails.AirlineName,
              direction: flightDetails.JourneyType
            }
          })
        }
      })
      this.setState({
        flights: details,
        tripType: 'O',
        paxAdults: 1,
        paxChildren: 0,
        paxInfants: 0,
        classCode: 'Economy'
      })
      console.log(this.state);
    })
  }

  render () {
    return (
      <div style={{...createEventBoxStyle, ...{width: '100%', paddingBottom: '10px'}}}>
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
            <input style={{width: '90%'}} onChange={(e) => this.setState({
              search: e.target.value
            }, () => console.log(this.state))} />
            <i key='more' onClick={() => this.props.handleCreateEventClick('Flight')} className='material-icons' style={{position: 'absolute', right: '12%', color: '#ed9fad', cursor: 'pointer'}}>more_horiz</i>
            {this.state.showFlights &&
              <div style={intuitiveDropdownStyle}>
                {this.state.flights.filter(flight => (flight.flights[0].carrierCode + flight.flights[0].flightNum).includes(this.state.search.replace(/\s/g, '').toUpperCase())).map((flight, i) => {
                  const totalHours = Math.floor(flight.totalDuration / 60) ? Math.floor(flight.totalDuration / 60) + ' h ' : null
                  const totalMins = flight.totalDuration % 60 + ' min'
                  return (
                    <div key={i} style={{padding: '5px 5px 10px 5px', ':hover': {backgroundColor: 'rgb(210, 210, 210)'}}}>
                      <h5 style={{fontSize: '1em', margin: '0', color: '#3C3A44', display: 'inline-block', fontWeight: 'bold', width: '30%'}}>
                        {flight.flights[0].carrierCode} {flight.flights[0].flightNum}
                      </h5>
                      <h5 style={{fontSize: '1em', margin: '0', color: '#3C3A44', display: 'inline-block', width: '40%'}}>
                        {flight.flights.length === 1 ? 'Direct' : 'via XXX'}
                      </h5>
                      <h5 style={{fontSize: '1em', margin: '0', color: '#3C3A44', display: 'inline-block', width: '30%'}}>
                        {totalHours}{totalMins}
                      </h5>
                    </div>
                  )
                })}
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default IntuitiveFlightInput
