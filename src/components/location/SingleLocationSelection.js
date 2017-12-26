import React, { Component } from 'react'
import Radium from 'radium'
import LocationSearch from './LocationSearch'
import LocationMapHOC from './LocationMapHOC'

import { locationMapContainerStyle } from '../../Styles/styles'

class SingleLocationSelection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mapIsOpen: false
    }
  }

  selectLocation (location) {
    // stringify opening hours here
    if (location.openingHours) {
      location.openingHours = JSON.stringify(location.openingHours)
    }
    this.setState({mapIsOpen: false})
    this.props.selectLocation(location) // pass it up to createActivityForm googlePlaceData
  }

  toggleMap () {
    this.setState({mapIsOpen: !this.state.mapIsOpen})
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <LocationSearch selectLocation={location => this.selectLocation(location)} toggleMap={() => this.toggleMap()} placeholder={'Input Location'} currentLocation={this.props.currentLocation} />

        {this.state.mapIsOpen &&
        <div style={locationMapContainerStyle}>
          <LocationMapHOC selectLocation={(obj) => this.selectLocation(obj)} toggleMap={() => this.toggleMap()} currentLocation={this.props.currentLocation} />
        </div>
        }
      </div>
    )
  }
}

export default Radium(SingleLocationSelection)
