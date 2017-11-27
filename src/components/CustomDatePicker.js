import React, { Component } from 'react'

class CustomDatePicker extends Component {
  render () {
    return (
      <span
        onClick={this.props.onClick}
        style={{fontSize: '16px', background: 'transparent', position: 'relative', top: '-3px', textTransform: 'uppercase'}}>
        {this.props.value}
      </span>
    )
  }
}

export default CustomDatePicker
