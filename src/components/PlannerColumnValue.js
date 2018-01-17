import React, { Component } from 'react'
import Radium from 'radium'
import { columnValueContainerStyle, expandEventIconStyle } from '../Styles/styles'

const columnValues = {
  'Price': 'cost',
  'Booking Status': 'bookingStatus',
  'Booking Platform': 'bookedThrough',
  'Notes': 'notes'
}

class PlannerColumnValue extends Component {
  render () {
    if (this.props.expandedEvent) {
      return (
        <td style={{position: 'relative'}}>
          {this.props.isLast && this.props.expandedEvent && (
            <i key='eventOptions' className='material-icons' style={expandEventIconStyle} onClick={() => this.props.expandEvent()}>expand_less</i>
          )}
        </td>
      )
    }
    return (
      <td colSpan={this.props.column === 'Notes' ? 4 : 1} style={columnValueContainerStyle(this.props.column)}>
        <span style={{padding: '1px', ':hover': {outline: '1px solid black'}}}>
          {this.renderInfo()}
        </span>
        {this.props.isLast && this.props.hover && !this.props.expandedEvent && !this.props.activity.dropzone && <i key='eventOptions' className='material-icons' style={expandEventIconStyle} onClick={() => this.props.expandEvent()}>expand_more</i>}
      </td>
    )
  }

  renderInfo () {
    const start = !this.props.activity.dropzone && (this.props.activity.start || typeof this.props.activity.start !== 'boolean')
    const flightBookingOrInstance = {
      Price: 'FlightBooking',
      'Booking Status': 'FlightBooking',
      'Booking Platform': 'FlightBooking',
      Notes: 'FlightInstance'
    }
    let value = this.props.activity[this.props.activity.type][columnValues[this.props.column]]
    if (this.props.activity.type === 'Flight') value = this.props.activity[this.props.activity.type][flightBookingOrInstance[this.props.column]][columnValues[this.props.column]]
    switch (this.props.column) {
      case 'Notes':
        if (start) return value || ''
        else return ''
      case 'Price':
        if (this.props.activity.type === 'Flight' && this.props.firstInFlightBooking && start) {
          return value || ''
        } else if (this.props.activity.type === 'Flight') {
          return ''
        } else {
          if (start) return value || ''
          else return ''
        }
      case 'Booking Status':
        if (start) return value === false ? 'Not Booked' : 'Booked'
        else return ''
      case 'Booking Platform':
        if (start) return value
        else return ''
      default:
        return value
    }
  }
}

export default Radium(PlannerColumnValue)
