import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Radium from 'radium'
import GooglePlaceResult from './GooglePlaceResult'

import { locationSelectionInputStyle, locationDropdownStyle, locationMapContainerStyle } from '../../Styles/styles'

// ENTIRE LOCATION COMPONENT (DEPARTURE + ARRIVAL + ADDRESS + SHARED MAP). DIFFERENT LOGIC FROM LOCATION SELECTION

class TransportLocationSelection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      departureSearch: '',
      arrivalSearch: '',
      selecting: false,
      results: []
    }
  }

  // handleChange (e, field) {
  //   this.setState({`${field}Search`})
  // }

  render () {
    return (
      <div>
        <textarea id='transportDepartureLocation' className='left-panel-input' rows='1' autoComplete='off' onChange={(e) => this.handleChange(e, 'departureSearch')}
      </div>
    )
  }
}

export default TransportLocationSelection
