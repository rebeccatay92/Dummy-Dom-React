import React, { Component } from 'react'
import Radium from 'radium'

class LocationDetails extends Component {
  render () {
    return (
      <div style={{position: 'relative', border: '1px solid white'}}>
        <h6>Address</h6>
        <h6>Tel:</h6>
        <h6>Opening:</h6>
      </div>
    )
  }
}

export default LocationDetails
