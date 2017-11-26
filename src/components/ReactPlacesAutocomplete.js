import React, { Component } from 'react'
import { compose, withProps, withStateHandlers, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow, OverlayView } from 'react-google-maps'
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'

const _ = require('lodash')

const getPixelPositionOffset = (width, height) => ({
  x: 0,
  y: -(300),
})

const MyMapComponent = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDwlTicqOxDlB2u3MhiEusUJyo_QQy-MZU&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  lifecycle({
    componentWillMount () {
      const refs = {}
      this.setState({
        bounds: null,
        center: {
          lat: 41.9, lng: -87.624
        },
        markers: [],
        infoOpen: false,
        markerIndex: null,
        onMapMounted: ref => {
          refs.map = ref
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter()
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref
        },
        onMarkerMounted: ref => {
          refs.marker = ref
        },
        onOverlayViewMounted: ref => {
          refs.overlayView = ref
        },
        handleMarkerClick: (index) => {
          // console.log('index', index)
          var marker = this.state.markers[index]
          console.log('place', marker.place)
          if (!this.state.infoOpen || this.state.markerIndex !== index) {
            this.setState({infoOpen: true})
            this.setState({markerIndex: index})
          } else {
            this.setState({infoOpen: false})
            this.setState({markerIndex: null})
          }
        },
        closeInfoWindow: () => {
          this.setState({infoOpen: false})
          this.setState({markerIndex: null})
          // console.log('close info window')
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces()
          const bounds = new window.google.maps.LatLngBounds()

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          })
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
            place: place
          }))
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center)

          this.setState({
            center: nextCenter,
            markers: nextMarkers
          })
          // refs.map.fitBounds(bounds);
          // if (places.length === 1) {
          //   this.setState({infoOpen: true})
          //   this.setState({markerIndex: 0})
          // }
        }
      })
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap ref={props.onMapMounted} defaultZoom={15} center={props.center} onBoundsChanged={props.onBoundsChanged} style={{position: 'relative'}}>
    <div style={{background: 'white', height: '50px', width: '200px', position: 'absolute', top: '90px', left: '600px', zIndex: '999'}}>
      <h4>Selected Location: </h4>
    </div>
    {/* <OverlayView ref={props.onOverlayViewMounted} position={props.center} mapPaneName={OverlayView.FLOAT_PANE} getPixelPositionOffset={getPixelPositionOffset}>
      <div style={{background: 'white', width: '300px', height: '100px'}}>
        <h4>Selected Location:</h4>
      </div>
    </OverlayView> */}
    <SearchBox ref={props.onSearchBoxMounted} bounds={props.bounds} controlPosition={window.google.maps.ControlPosition.TOP_LEFT} onPlacesChanged={props.onPlacesChanged}>
      <input type='text' placeholder='Search for location'
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `300px`,
          height: `30px`,
          marginTop: `10px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} onClick={() => props.handleMarkerClick(index)}>
        {props.infoOpen && props.markerIndex === index && <InfoWindow key={index} onCloseClick={props.closeInfoWindow}>
          <div>
            <h5>Name: {marker.place.name}</h5>
            <h5>Address: {marker.place.formatted_address}</h5>
            <h5>place_id: {marker.place.place_id}</h5>
          </div>
        </InfoWindow>}
      </Marker>
    )}
  </GoogleMap>
)

class MyFancyComponent extends Component {
  render () {
    return (
      <div>

        <MyMapComponent />
      </div>
    )
  }
}

export default MyFancyComponent
