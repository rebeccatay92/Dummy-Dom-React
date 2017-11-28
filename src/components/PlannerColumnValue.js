import React, { Component } from 'react'
import Radium from 'radium'

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
        {this.props.isLast && this.props.hover && <i key='eventOptions' className='material-icons' style={{position: 'absolute', right: '0px', top: '20px', opacity: '0.6', ':hover': {opacity: '1.0'}}}>more_vert</i>}
      </td>
    )
  }

  renderInfo () {
    switch (this.props.column) {
      case 'Booking Status':
        if (this.props.activity[columnValues[this.props.column]]) return 'Booked'
        else if (this.props.activity[columnValues[this.props.column]] === false) return 'Not Booked'
        else return ''
      default:
        return this.props.activity[columnValues[this.props.column]]
    }
  }
}

export default Radium(PlannerColumnValue)
