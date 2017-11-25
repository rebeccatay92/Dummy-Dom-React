import React, { Component } from 'react'
import Radium from 'radium'

const crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
var key = 'key=AIzaSyDwlTicqOxDlB2u3MhiEusUJyo_QQy-MZU'
var placeDetails = `https://maps.googleapis.com/maps/api/place/details/json?`

class GooglePlaceResult extends Component {
  constructor (props) {
    super(props)
    this.state = {
      place_id: this.props.result.place_id,
      countryCode: '',
      name: this.props.result.name,
      address: this.props.result.formatted_address,
      latitude: this.props.result.geometry.location.lat,
      longitude: this.props.result.geometry.location.lng,
      openingHours: []
    }
  }

  selectLocation () {
    var urlPlaceDetails = crossOriginUrl + placeDetails + key + `&placeid=${this.props.result.place_id}`
      fetch(urlPlaceDetails)
        .then(response => {
          return response.json()
        })
        .then(json => {
          if (json.result.opening_hours) {
            this.setState({openingHours: json.result.opening_hours.periods})
          }
          var addressComponents = json.result.address_components
          addressComponents.forEach(e => {
            if (e.types.includes('country')) {
              this.setState({countryCode: e.short_name})
            }
          })
        })
        .catch(err => {
          console.log('err', err)
        })
        .then(() => {
          // pass location up to parent LocationSelection
          var location = {}
          Object.keys(this.state).forEach(key => {
            if (key !== '_radiumStyleState' && key !== 'openingHours' && key !== 'place_id') {
              location[key] = this.state[key]
            }
          })
          //stringify the openingHours array first
          location.placeId = this.state.place_id
          location.openingHours = JSON.stringify(this.state.openingHours)

          this.props.selectLocation(location)
        })
  }

  render () {
    return (
      <div onClick={() => this.selectLocation()} style={{':hover': {backgroundColor: 'rgb(210, 210, 210)'}}}>
        <h4 style={{fontSize: '1em', padding: '0', margin: '0'}}>{this.state.name} <span style={{color: 'rgb(120, 120, 120)'}}>{this.state.address}</span></h4>
      </div>
    )
  }
}

export default Radium(GooglePlaceResult)
