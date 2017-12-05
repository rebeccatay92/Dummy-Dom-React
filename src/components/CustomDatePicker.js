import React, { Component } from 'react'
import Radium from 'radium'

class CustomDatePicker extends Component {
  render () {
    return (
      <span
        key='datePicker'
        onClick={this.props.onClick}
        style={{fontSize: '24px', background: 'transparent', textTransform: 'uppercase', ':hover': {boxShadow: '0 1px 0 #FFF'}}}>
        {this.props.value}
      </span>
    )
  }
}

export default Radium(CustomDatePicker)
