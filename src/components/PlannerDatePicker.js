import React, { Component } from 'react'
import Radium from 'radium'

class PlannerDatePicker extends Component {
  render () {
    return (
      <span
        key='datePicker'
        onClick={this.props.onClick}
        style={{fontSize: '16px', background: 'transparent', position: 'relative', top: '-3px', textTransform: 'uppercase', ':hover': {boxShadow: '0 1px 0 #FFF'}}}>
        {this.props.value}
      </span>
    )
  }
}

export default Radium(PlannerDatePicker)
