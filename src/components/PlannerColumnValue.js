import React, { Component } from 'react'
import Radium from 'radium'
import { primaryColor } from '../Styles/styles'

const columnValues = {
  'Price': 'cost',
  'Booking Status': 'bookingStatus',
  'Booking Platform': 'bookedThrough',
  'Notes': 'notes'
}

class PlannerColumnValue extends Component {
  render () {
    return (
      <td colSpan={this.props.column === 'Notes' ? 4 : 1} style={{position: 'relative', textAlign: this.props.column === 'Notes' ? 'left' : 'center', verticalAlign: 'top', color: '#9FACBC', fontSize: '16px', paddingTop: '12px', width: `${0.2 * 962}px`}}>
        {this.renderInfo()}
        {this.props.isLast && this.props.hover && <i key='eventOptions' className='material-icons' style={{position: 'absolute', right: '0px', top: '20px', ':hover': {color: primaryColor}}}>more_vert</i>}
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
