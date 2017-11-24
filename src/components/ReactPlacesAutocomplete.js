import React, {Component} from 'react'
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox'

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
      <div>
        <GoogleMap defaultZoom={10} defaultCenter={{ lat: 1.400, lng: 104.000 }} >
          <SearchBox controlPosition={window.google.maps.ControlPosition.TOP_LEFT}>
            <input type='text' placeholder='Search for a location' style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              marginTop: `10px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`
            }} />
          </SearchBox>
        </GoogleMap>
      </div>
    )
  }
}

const Testing = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDwlTicqOxDlB2u3MhiEusUJyo_QQy-MZU&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(ReactPlacesAutocomplete)

export default Testing
