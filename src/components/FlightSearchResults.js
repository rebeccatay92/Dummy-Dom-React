import React, { Component } from 'react'
import { searchResultsTableStyle } from '../Styles/styles'

class FlightSearchResults extends Component {
  render () {
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
            return (
              <tr key={i} style={{height: '9vh'}}>
                <td style={{textAlign: 'center', padding: '0  5px'}}>
                  <img src='https://imgur.com/pKiZDze.jpg' style={{height: '16px'}} />
                  <span style={{display: 'block'}}>
                    {flight.flights[0].airlineName}
                  </span>
                </td>
                <td style={{textAlign: 'center', padding: '5px'}}>
                  {flight.flights[0].departureAirportCode}
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default FlightSearchResults
