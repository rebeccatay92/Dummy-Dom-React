import React, { Component } from 'react'

class LocationDetails extends Component {
  render () {
    return (
      <div style={{position: 'relative', border: '1px solid white'}}>
        <h6>Address: {this.props.locationDetails.address}</h6>
        <h6>Tel: {this.props.locationDetails.telephone}</h6>
        <h6>Opening: {this.props.locationDetails.openingHours}</h6>
      </div>
    )
  }
}

export default LocationDetails
