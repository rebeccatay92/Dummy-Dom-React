import React, { Component } from 'react'
import Radium from 'radium'
import LocationSearch from './LocationSearch'
import LocationMapHOC from './LocationMapHOC'
import LocationDetails from './LocationDetails'

import { locationMapContainerStyle } from '../../Styles/styles'

class SingleLocationSelection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mapIsOpen: false
    }
  }

  selectLocation (place) {
    console.log('SingleLocationSelection', place)
    // construct googlePlaceData
    var googlePlaceData = {
      placeId: place.place_id,
      countryCode: null,
      name: place.name,
      address: place.formatted_address,
      latitude: null,
      longitude: null,
      openingHours: null
    }
    if (place.openingHours && place.openingHours.periods) {
      googlePlaceData.openingHours = JSON.stringify(place.openingHours.periods)
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
    this.setState({mapIsOpen: false})
    this.props.selectLocation(googlePlaceData)
    // pass it up to form
  }

  toggleMap () {
    this.setState({mapIsOpen: !this.state.mapIsOpen})
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <LocationSearch selectLocation={place => this.selectLocation(place)} toggleMap={() => this.toggleMap()} placeholder={'Input Location'} currentLocation={this.props.currentLocation} />
        <LocationDetails />

        {this.state.mapIsOpen &&
        <div style={locationMapContainerStyle}>
          <LocationMapHOC selectLocation={(place) => this.selectLocation(place)} toggleMap={() => this.toggleMap()} currentLocation={this.props.currentLocation} />
        </div>
        }
      </div>
    )
  }
}

export default Radium(SingleLocationSelection)
