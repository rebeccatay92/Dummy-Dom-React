import React, { Component } from 'react'
import Radium from 'radium'

class CustomDatePicker extends Component {
  render () {
    return (
      <button
        key='datePicker'
        onClick={this.props.onClick}
        style={{verticalAlign: 'middle', border: '0px', minWidth: '103px', minHeight: '24.5px', fontSize: this.props.flight ? '16px' : '24px', background: 'transparent', textTransform: 'uppercase', ':hover': {boxShadow: '0 1px 0 #FFF'}}}>
        {this.props.value}
      </button>
    )
  }
}

export default Radium(CustomDatePicker)
