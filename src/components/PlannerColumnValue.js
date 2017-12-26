import React, { Component } from 'react'
import Radium from 'radium'
import { columnValueContainerStyle, eventDropdownStyle } from '../Styles/styles'

const columnValues = {
  'Price': 'cost',
  'Booking Status': 'bookingStatus',
  'Booking Platform': 'bookedThrough',
  'Notes': 'notes'
}

class PlannerColumnValue extends Component {
  render () {
    return (
      <td colSpan={this.props.column === 'Notes' ? 4 : 1} style={columnValueContainerStyle(this.props.column)}>
        {this.renderInfo()}
        {this.props.isLast && this.props.hover && !this.props.activity.dropzone && <i key='eventOptions' className='material-icons' style={eventDropdownStyle}>more_vert</i>}
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
