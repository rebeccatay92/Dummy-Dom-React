import React, { Component } from 'react'

class PlannerDatePicker extends Component {
  render () {
    return (
      <span
        onClick={this.props.onClick}
        style={{fontSize: '16px', background: '#6D6A7A', position: 'relative', top: '-3px', textTransform: 'uppercase'}}>
        {this.props.value}
      </span>
    )
  }
}

export default PlannerDatePicker
