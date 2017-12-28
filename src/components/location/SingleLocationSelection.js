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
      mapIsOpen: false,
      locationDetails: null
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
    this.setState({mapIsOpen: false})
    // pass it up to form
    this.props.selectLocation(googlePlaceData)

    // take out location details
    var address = place.formatted_address
    var telephone = place.internation_phone_number || place.formatted_phone_number
    // var openingHours =
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
