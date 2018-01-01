import React, { Component } from 'react'
import LocationSearch from './LocationSearch'
import TransportMapHOC from './TransportMapHOC'
import LocationDetails from './LocationDetails'

import { locationMapContainerStyle } from '../../Styles/styles'

// ENTIRE LOCATION COMPONENT (DEPARTURE + ARRIVAL + ADDRESS + SHARED MAP)

class TransportLocationSelection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mapIsOpen: false,
      mapLocationType: null
    }
  }

  selectLocation (place, type) {
    this.props.selectLocation(place, type)

    this.setState({mapIsOpen: false})
    this.setState({mapLocationType: null})
  }

  toggleMap (type) {
    this.setState({mapIsOpen: !this.state.mapIsOpen})
    if (type) {
      this.setState({mapLocationType: type})
    } else {
      this.setState({mapLocationType: null})
    }
  }

  render () {
    return (
      <div>
        <LocationSearch selectLocation={place => this.selectLocation(place, 'departure')} toggleMap={() => this.toggleMap('departure')} placeholder={'Departure Location'} currentLocation={this.props.departureLocation} />
        {/* DEPARTURE PLACEHOLDER OVERFLOW NOT SEEN */}
        <LocationDetails dates={this.props.dates} startDay={this.props.startDay} endDay={this.props.endDay} day={this.props.startDay} googlePlaceDetails={this.props.departureGooglePlaceDetails} />

        <p style={{textAlign: 'center'}}>to</p>
        <LocationSearch selectLocation={place => this.selectLocation(place, 'arrival')} toggleMap={() => this.toggleMap('arrival')} placeholder={'Arrival Location'} currentLocation={this.props.arrivalLocation} />
        <LocationDetails dates={this.props.dates} startDay={this.props.startDay} endDay={this.props.endDay} day={this.props.endDay} googlePlaceDetails={this.props.arrivalGooglePlaceDetails} />

        {this.state.mapIsOpen &&
        <div style={locationMapContainerStyle}>
          <TransportMapHOC toggleMap={() => this.toggleMap()} selectLocation={(place) => this.selectLocation(place, this.state.mapLocationType)} departureLocation={this.props.departureLocation} arrivalLocation={this.props.arrivalLocation} mapLocationType={this.state.mapLocationType} />
        </div>
        }
      </div>
    )
  }
}

export default TransportLocationSelection
