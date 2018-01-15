import React, { Component } from 'react'
import { expandedEventPropStyle, expandedEventValueStyle } from '../Styles/styles'

class PlannerEventExpandedInfo extends Component {
  render () {
    return (
      <p style={{marginBottom: '8px'}}>
        <span style={expandedEventPropStyle}>{this.props.name}</span><span style={expandedEventValueStyle}>{' '}{this.props.value}</span>
      </p>
    )
  }
}

export default PlannerEventExpandedInfo
