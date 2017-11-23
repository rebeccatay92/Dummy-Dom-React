import React, {Component} from 'react'
import { compose, withProps } from 'recompose'
import { withGoogleMap, withScriptJs, GoogleMap } from 'react-google-maps'

class ReactPlacesAutocomplete extends Component {
  constructor (props) {
    super(props)
    // let timeout
    // this.state = {
    //   search: ''
    // }
  }

  // handleChange (e) {
  //   this.setState({search: e.target.value})
  // }
  //
  // customDebounce () {
  //   var queryStr = this.state.search
  //   clearTimeout(this.timeout)
  //   this.timeout = setTimeout(() => {
  //     this.autocomplete(queryStr)
  //   }, 250)
  // }
  //
  // autocomplete () {
  //   var service = new window.google.maps.places.AutocompleteService()
  //   service.getPlacePredictions({input: this.state.search}, function (predictions, status) {
  //     console.log(predictions, status)
  //   })
  // }

  render () {
    return (
      <GoogleMap defaultZoom={10} defaultCenter={{ lat: 1.400, lng: 104.000 }} />
    )
  }
}
export default withGoogleMap(ReactPlacesAutocomplete)
