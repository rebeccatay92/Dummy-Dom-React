import React, { Component } from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline, InfoWindow } from 'react-google-maps'

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
          console.log('departure', this.props.departureLocation)
          console.log('arrival', this.props.arrivalLocation)
        },
        handleMarkerChange () {
          console.log('position changed')
        }
      })
    },
    componentWillReceiveProps (nextProps) {
      console.log('will receive props')
      // console.log('nextProps', nextProps)
      if (this.props.departureLocation !== nextProps.departureLocation) {
        console.log('next departure location', nextProps.departureLocation)
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap ref={props.onMapMounted} defaultZoom={2} center={props.center} onBoundsChanged={props.onBoundsChanged} style={{position: 'relative'}} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false}}>
    {/* <Marker ref={props.onMarkerMounted} position={props.center} /> */}
    {/* GOOGLE ONPOSITIONCHANGED HAS NO ARGS */}
    {props.departureLocation &&
    <Marker ref={props.onMarkerMounted} position={{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}} location={props.departureLocation}>
      <InfoWindow>
        <div>
          <h5>{props.departureLocation.name}</h5>
        </div>
      </InfoWindow>
    </Marker>
    }

    {props.arrivalLocation &&
    <Marker ref={props.onMarkerMounted} position={{lat: props.arrivalLocation.latitude, lng: props.arrivalLocation.longitude}} location={props.arrivalLocation}>
      <InfoWindow>
        <div>
          <h5>{props.arrivalLocation.name}</h5>
        </div>
      </InfoWindow>
    </Marker>
    }

    {/* {(props.departureLocation && props.arrivalLocation) &&
      <Polyline path={[{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}, {lat: props.arrivalLocation.latitude, lng: props.arrivalLocation.longitude}]} options={{geodesic: false}} />
    } */}
  </GoogleMap>
)

class FlightMapHOC extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount () {
    console.log('flight hoc mount')
    console.log('departure', this.props.departureLocation)
  }
  render () {
    return (
      <FlightMap departureLocation={this.props.departureLocation} arrivalLocation={this.props.arrivalLocation} testing={'hello'} />
    )
  }
}

export default FlightMapHOC
