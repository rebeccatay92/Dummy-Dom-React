import React, { Component } from 'react'
import moment from 'moment'
import { searchResultsTableStyle } from '../Styles/styles'

class FlightSearchResults extends Component {
  render () {
    if (!this.props.searching) return null
    return (
      <table style={searchResultsTableStyle}>
        <thead>
          <tr>
            <th style={{width: '10%', textAlign: 'center'}}>

            </th>
            <th style={{width: '10%', textAlign: 'center'}}>
              Departure
            </th>
            <th style={{width: '45%', textAlign: 'center'}}>
              Duration
            </th>
            <th style={{width: '10%', textAlign: 'center'}}>
              Arrival
            </th>
            <th style={{width: '25%', textAlign: 'center'}}>
              Estimated Cost
            </th>
          </tr>
        </thead>
        <tbody>
          {this.props.flights.map((flight, i) => {
            const totalHours = Math.floor(flight.totalDuration / 60) ? Math.floor(flight.totalDuration / 60) + ' h ' : null
            const totalMins = flight.totalDuration % 60
            let layoverTime, layoverHours, layoverMins, layoverAirport
            if (flight.flights.length > 1) {
              layoverTime = moment(new Date(flight.flights[1].departureDateTime) - new Date(flight.flights[0].arrivalDateTime)).unix()
              layoverHours = Math.floor(layoverTime / 3600) ? Math.floor(layoverTime / 3600) + ' h ' : null
              layoverMins = layoverTime % 3600 / 60
              layoverAirport = flight.flights[0].arrivalAirportCode
            }
            return (
              <tr key={i} style={{height: '9vh'}}>
                <td style={{textAlign: 'center', padding: '0  5px'}}>
                  <img src={`${process.env.PUBLIC_URL}/img/airlinelogos/${flight.flights[0].carrierCode}.png`} style={{height: '16px'}} />
                  <span style={{display: 'block', fontSize: '13px'}}>
                    {flight.flights[0].airlineName}
                  </span>
                </td>
                <td style={{textAlign: 'center', padding: '5px'}}>
                  <p style={{margin: 0, color: '#ed9fad'}}>{moment(flight.flights[0].departureDateTime).format('HH:mm')}</p>
                  <p style={{margin: 0}}>{flight.flights[0].departureAirportCode}</p>
                </td>
                <td style={{textAlign: 'center'}}>
                  <p style={{margin: 0, color: '#ed9fad'}}>{totalHours + totalMins + ' min'}</p>
                  <hr style={{width: '100%', height: '1px', margin: 0}} />
                  <p style={{margin: 0}}>{flight.flights.length > 1 ? layoverHours + layoverMins + ' min ' + layoverAirport : 'no layover'}</p>
                </td>
                <td style={{textAlign: 'center', padding: '5px'}}>
                  <p style={{margin: 0, color: '#ed9fad'}}>{moment(flight.flights[flight.flights.length - 1].arrivalDateTime).format('HH:mm')}</p>
                  <p style={{margin: 0}}>{flight.flights[flight.flights.length - 1].arrivalAirportCode}</p>
                </td>
                <td style={{textAlign: 'center', fontSize: '20px'}}>
                  <p style={{margin: 0, color: '#ed9fad'}}>USD {flight.cost}</p>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default FlightSearchResults
