import React, { Component } from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline, InfoWindow } from 'react-google-maps'
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'

const FlightMap = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDwlTicqOxDlB2u3MhiEusUJyo_QQy-MZU&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: (755 * 0.9) + 'px' }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  lifecycle({
    componentWillMount () {
      const refs = {}
      this.setState({
        bounds: null,
        center: {
          lat: 0, lng: 0
        },
        onMapMounted: ref => {
          refs.map = ref
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter()
          })
        },
        onMarkerMounted: ref => {
          refs.marker = ref
          console.log('marker mounted')

          // CENTERS MAP ON FIRST MARKER
          if (this.props.departureLocation && !this.props.arrivalLocation) {
            this.setState({center: {lat: this.props.departureLocation.latitude, lng: this.props.departureLocation.longitude}})
          }
          if (!this.props.departureLocation && this.props.arrivalLocation) {
            this.setState({center: {lat: this.props.arrivalLocation.latitude, lng: this.props.arrivalLocation.longitude}})
          }
        },
        handleMarkerChange: () => {
          // console.log('refs', this)
          console.log('airport/city changed')
          // console.log('this', this)
          if (this.props.departureLocation && this.props.arrivalLocation) {
            const bounds = new window.google.maps.LatLngBounds()
            bounds.extend({lat: this.props.departureLocation.latitude, lng: this.props.departureLocation.longitude})
            bounds.extend({lat: this.props.arrivalLocation.latitude, lng: this.props.arrivalLocation.longitude})
            refs.map.fitBounds(bounds, 100)
          }
        }
      })
    },
    componentWillReceiveProps (nextProps) {
      // console.log('this', this)
      if (nextProps.departureLocation && nextProps.arrivalLocation) {
        // console.log('departure', nextProps.departureLocation)
        // console.log('arrival', nextProps.arrivalLocation)
        if ((this.state.departureLocation !== nextProps.departureLocation) || (this.state.arrivalLocation !== nextProps.arrivalLocation)) {
          this.state.handleMarkerChange()
        }
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap ref={props.onMapMounted} defaultZoom={2} center={props.center} onBoundsChanged={props.onBoundsChanged} style={{position: 'relative'}} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false}}>

    {/* {props.departureLocation &&
      <MarkerWithLabel position={{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}} location={props.departureLocation} labelAnchor={new window.google.maps.Point(50, 100)} labelStyle={{backgroundColor: 'white', fontSize: '15px', padding: '5px'}}>
        <div>{props.departureLocation.name}</div>
      </MarkerWithLabel>
    }
    {props.arrivalLocation &&
      <MarkerWithLabel position={{lat: props.arrivalLocation.latitude, lng: props.arrivalLocation.longitude}} location={props.arrivalLocation} labelAnchor={new window.google.maps.Point(0, 15)} labelStyle={{backgroundColor: 'white', fontSize: '15px', padding: '5px'}}>
        <div>{props.arrivalLocation.name}</div>
      </MarkerWithLabel>
    } */}

    {props.departureLocation &&
      <Marker ref={props.onMarkerMounted} position={{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}} location={props.departureLocation}>
        <InfoWindow>
          <div>
            <h5>{props.departureLocation.name}</h5>
          </div>
        </InfoWindow>
      </Marker>
    }
    {/* <InfoBox
      position={{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}}
      options={{ closeBoxURL: ``, enableEventPropagation: true }}
      >
        <div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `5px` }}>
          <div style={{ fontSize: `15px`, fontColor: `#08233B` }}>
            Hello, Taipei!
          </div>
        </div>
      </InfoBox> */}

    {props.arrivalLocation &&
      <Marker ref={props.onMarkerMounted} position={{lat: props.arrivalLocation.latitude, lng: props.arrivalLocation.longitude}} location={props.arrivalLocation}>
        <InfoWindow>
          <div>
            <h5>{props.arrivalLocation.name}</h5>
          </div>
        </InfoWindow>
      </Marker>
    }

    {(props.departureLocation && props.arrivalLocation) &&
      <Polyline path={[{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}, {lat: props.arrivalLocation.latitude, lng: props.arrivalLocation.longitude}]} options={{geodesic: false}} />
    }
  </GoogleMap>
)

class FlightMapHOC extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <FlightMap departureLocation={this.props.departureLocation} arrivalLocation={this.props.arrivalLocation} />
    )
  }
}

export default FlightMapHOC
