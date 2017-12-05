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
        {this.props.isLast && this.props.hover && <i key='eventOptions' className='material-icons' style={eventDropdownStyle}>more_vert</i>}
      </td>
    )
  }

  renderInfo () {
    const start = this.props.activity.start || typeof this.props.activity.start !== 'boolean'
    const value = this.props.activity[this.props.activity.type][columnValues[this.props.column]]
    switch (this.props.column) {
      case 'Price':
        if (start) return value || ''
        else return ''
      case 'Booking Status':
        if (value && start) return 'Booked'
        else if (value === false && start) return 'Not Booked'
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
