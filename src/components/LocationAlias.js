import React, { Component } from 'react'

const labelStyle = {
  fontSize: '13px',
  display: 'block',
  margin: '0',
  lineHeight: '26px'
}

class LocationAlias extends Component {
  render () {
    return (
      <div>
        <label style={labelStyle}>
            Detailed Location
        </label>
        <input className='form-input' style={{width: '100%'}} type='text' name='locationAlias' placeholder='(Optional)' />
      </div>
    )
  }
}

export default LocationAlias
