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
    var googlePlaceData = {
      placeId: place.place_id,
      countryCode: null,
      name: place.name,
      address: place.formatted_address,
      latitude: null,
      longitude: null,
      openingHours: null
    }

    if (place.opening_hours && place.opening_hours.periods) {
      googlePlaceData.openingHours = JSON.stringify(place.opening_hours.periods)
    }
    place.address_components.forEach(e => {
      if (e.types.includes('country')) {
        googlePlaceData.countryCode = e.short_name
      }
    })

    // depending on whether lat/lng comes from search or map
    if (typeof (place.geometry.location.lat) === 'number'){
      googlePlaceData.latitude = place.geometry.location.lat
      googlePlaceData.longitude = place.geometry.location.lng
    } else {
      googlePlaceData.latitude = place.geometry.location.lat()
      googlePlaceData.longitude = place.geometry.location.lng()
    }

    this.props.selectLocation(googlePlaceData, type)

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
        <LocationDetails />

        <p style={{textAlign: 'center'}}>to</p>
        <LocationSearch selectLocation={place => this.selectLocation(place, 'arrival')} toggleMap={() => this.toggleMap('arrival')} placeholder={'Arrival Location'} currentLocation={this.props.arrivalLocation} />
        <LocationDetails />

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
