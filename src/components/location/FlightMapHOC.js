import React, { Component } from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline, InfoWindow } from 'react-google-maps'
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
        departureWindow: true,
        arrivalWindow: true,
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
          // console.log('marker mounted')
        },
        handleMarkerChange: () => {
          var departure = this.props.departureLocation
          var arrival = this.props.arrivalLocation

          // CENTERS MAP IF ONLY 1 MARKER
          if (departure && !arrival) {
            this.setState({center: {lat: departure.latitude, lng: departure.longitude}})
          }
          if (!departure && arrival) {
            this.setState({center: {lat: arrival.latitude, lng: arrival.longitude}})
          }

          // CHANGE BOUNDS IF 2 MARKERS
          if (departure && arrival) {
            const bounds = new window.google.maps.LatLngBounds()
            bounds.extend({lat: departure.latitude, lng: departure.longitude})
            bounds.extend({lat: arrival.latitude, lng: arrival.longitude})
            refs.map.fitBounds(bounds, 100)
          }
        },
        toggleDepartureWindow: () => {
          this.setState({departureWindow: !this.state.departureWindow})
        },
        toggleArrivalWindow: () => {
          this.setState({arrivalWindow: !this.state.arrivalWindow})
        }
      })
    },
    componentDidUpdate (prevProps) {
      if ((this.props.departureLocation !== prevProps.departureLocation) || (this.props.arrivalLocation !== prevProps.arrivalLocation)) {
        this.state.handleMarkerChange()
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap ref={props.onMapMounted} defaultZoom={2} center={props.center} onBoundsChanged={props.onBoundsChanged} style={{position: 'relative'}} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false, zoomControl: false, gestureHandling: 'none'}}>

    {/* {props.departureLocation &&
      <Marker ref={props.onMarkerMounted} position={{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}} location={props.departureLocation} clickable={false}>
        <InfoBox position={new window.google.maps.LatLng(props.departureLocation.latitude, props.departureLocation.longitude)} options={{closeBoxURL: ``, enableEventPropagation: true, pixelOffset: new window.google.maps.Size(-100, -100)}}>
          <div style={{backgroundColor: `white`, padding: `10px`, borderRadius: '2px'}}>
            <div style={{ fontSize: `14px`, fontColor: `#08233B` }}>
              {props.departureLocation.name}
            </div>
          </div>
        </InfoBox>
      </Marker>
    } */}
    {props.departureLocation &&
      <Marker ref={props.onMarkerMounted} position={{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}} location={props.departureLocation} onClick={props.toggleDepartureWindow}>
        {props.departureWindow &&
          <InfoWindow ref={props.onDepartureWindowMounted} onCloseClick={props.toggleDepartureWindow}>
            <div>
              <h5>{props.departureLocation.name}</h5>
            </div>
          </InfoWindow>
        }
      </Marker>
    }
    {props.arrivalLocation &&
      <Marker ref={props.onMarkerMounted} position={{lat: props.arrivalLocation.latitude, lng: props.arrivalLocation.longitude}} location={props.arrivalLocation} onClick={props.toggleArrivalWindow}>
        {props.arrivalWindow &&
          <InfoWindow onCloseClick={props.toggleArrivalWindow}>
            <div>
              <h5>{props.arrivalLocation.name}</h5>
            </div>
          </InfoWindow>
        }
      </Marker>
    }

    {(props.departureLocation && props.arrivalLocation) &&
      <Polyline path={[{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}, {lat: props.arrivalLocation.latitude, lng: props.arrivalLocation.longitude}]} options={{geodesic: true, icons: [{icon: {path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW}, offset: '50%'}]}} />
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
