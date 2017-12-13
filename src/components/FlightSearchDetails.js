import React, { Component } from 'react'
import moment from 'moment'

import { timelineStyle } from '../Styles/styles'

class FlightSearchDetails extends Component {
  render () {
    const pStyle = {
      margin: '0'
    }
    const infoStyle = {...pStyle,
      ...{
        fontSize: '14px'
      }
    }
    const cityCountryStyle = {...pStyle,
      ...{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
        fontSize: '14px'
      }
    }
    const totalHours = Math.floor(this.props.flight.flights[this.props.index].duration / 60) ? Math.floor(this.props.flight.flights[this.props.index].duration / 60) + ' h ' : null
    const totalMins = this.props.flight.flights[this.props.index].duration % 60
    return (
      <div style={{textAlign: 'center', fontSize: '18px', color: 'white', position: 'relative'}}>
        {this.props.first ? <p>Departing Flight</p> : (
          <table style={{width: '100%', tableLayout: 'fixed', position: 'relative', height: '90px'}}>
            <tbody>
              <tr>
                <td style={{width: '100%'}}>
                  <div style={{...timelineStyle, ...{height: '55%', backgroundColor: 'white', opacity: '0.5', top: '-22%'}}} />
                  <p style={infoStyle}>layover 1 h 25 min</p>
                  <div style={{...timelineStyle, ...{height: '55%', top: '67%', backgroundColor: 'white', opacity: '0.5'}}} />
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <table style={{width: '100%', tableLayout: 'fixed'}}>
          <tbody>
            <tr>
              <td style={{width: '40%', textAlign: 'right'}}>
                <p style={pStyle}>{this.props.flight.flights[this.props.index].departureAirportCode}</p>
                <p style={infoStyle}>{this.props.flight.flights[this.props.index].departureLocation}</p>
                <p style={cityCountryStyle}>{this.props.flight.flights[this.props.index].departureCityCountry}</p>
                <p style={infoStyle}>Terminal {this.props.flight.flights[this.props.index].departureTerminal}</p>
                <p style={infoStyle}>{moment(this.props.flight.flights[this.props.index].departureDateTime).format('DD/MM/YYYY, HH:mm')}</p>
              </td>
              <td style={{width: '20%'}}>
                <img src={`${process.env.PUBLIC_URL}/img/airlinelogos/${this.props.flight.flights[this.props.index].carrierCode}.png`} style={{height: '24px'}} />
                <p style={infoStyle}>{this.props.flight.flights[this.props.index].carrierCode} {this.props.flight.flights[this.props.index].flightNum}</p>
                <p style={infoStyle}>{totalHours}{totalMins} m</p>
              </td>
              <td style={{width: '40%', textAlign: 'left'}}>
                <p style={pStyle}>{this.props.flight.flights[this.props.index].arrivalAirportCode}</p>
                <p style={infoStyle}>{this.props.flight.flights[this.props.index].arrivalLocation}</p>
                <p style={{...cityCountryStyle, ...{width: '99%'}}}>{this.props.flight.flights[this.props.index].arrivalCityCountry}</p>
                <p style={infoStyle}>Terminal {this.props.flight.flights[this.props.index].arrivalTerminal}</p>
                <p style={infoStyle}>{moment(this.props.flight.flights[this.props.index].arrivalDateTime).format('DD/MM/YYYY, HH:mm')}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default FlightSearchDetails
