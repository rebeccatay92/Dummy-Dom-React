import React, { Component } from 'react'
import Radium from 'radium'

import { plannerHeaderRightBarIconContainerStyle, plannerHeaderRightBarIconStyle } from '../Styles/styles'

class PlannerHeaderRightBarIcons extends Component {
  render () {
    return (
      <div style={{position: 'absolute', right: '0', bottom: '0'}}>
        <div key={'view'} style={{...plannerHeaderRightBarIconContainerStyle, ...{backgroundColor: '#ed6a5a'}}}>
          <i className='material-icons' style={plannerHeaderRightBarIconStyle} key={1}>view_list</i>
        </div>
        <div key={'share'} style={{...plannerHeaderRightBarIconContainerStyle, ...{backgroundColor: '#438496'}}}>
          <i className='material-icons' style={plannerHeaderRightBarIconStyle} key={2}>share</i>
        </div>
        <div key={'place'} style={{...plannerHeaderRightBarIconContainerStyle, ...{backgroundColor: '#a8dadc'}}}>
          <i className='material-icons' style={plannerHeaderRightBarIconStyle} key={3}>place</i>
        </div>
      </div>
    )
  }
}

export default Radium(PlannerHeaderRightBarIcons)
