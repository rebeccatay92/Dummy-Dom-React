import React, { Component } from 'react'
import Radium from 'radium'
import EventDropdownMenu from './EventDropdownMenu'
import { columnValueContainerStyle, eventDropdownStyle, eventDropdownExpandedStyle } from '../Styles/styles'

const columnValues = {
  'Price': 'cost',
  'Booking Status': 'bookingStatus',
  'Booking Platform': 'bookedThrough',
  'Notes': 'notes'
}

class PlannerColumnValue extends Component {
  constructor (props) {
    super(props)

    this.state = {
      expandedMenu: false
    }
  }
  render () {
    return (
      <td colSpan={this.props.column === 'Notes' ? 4 : 1} style={columnValueContainerStyle(this.props.column)}>
        {this.renderInfo()}
        {this.props.isLast && this.props.hover && !this.state.expandedMenu && !this.props.activity.dropzone && <i key='eventOptions' className='material-icons' style={eventDropdownStyle} onClick={() => this.setState({expandedMenu: !this.state.expandedMenu})}>more_vert</i>}
        {this.props.isLast && this.state.expandedMenu && !this.props.activity.dropzone && (
          <div>
            <i key='eventOptions' className='material-icons' style={eventDropdownExpandedStyle} onClick={() => this.setState({expandedMenu: !this.state.expandedMenu})}>more_vert</i>
            <EventDropdownMenu event={this.props.activity} itineraryId={this.props.itineraryId} toggleEventDropdown={() => this.toggleEventDropdown()} />
          </div>
        )}
      </td>
    )
  }

  toggleEventDropdown () {
    this.setState({
      expandedMenu: false
    })
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
