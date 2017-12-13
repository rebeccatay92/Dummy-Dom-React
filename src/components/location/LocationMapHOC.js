import React, { Component } from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'
import { MAP } from 'react-google-maps/lib/constants'
import CustomControl from './CustomControl'
const _ = require('lodash')

const LocationMap = compose(
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
          lat: 41.9, lng: -87.624
        },
        markers: [],
        infoOpen: false,
        markerIndex: null,
        googlePlaceData: {
          placeId: null,
          name: null,
          address: null,
          latitude: null,
          longitude: null,
          openingHours: null,
          countryCode: null
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
        onSearchBoxMounted: ref => {
          refs.searchBox = ref
        },
        onMarkerMounted: ref => {
          refs.marker = ref
        },
        onInfoWindowMounted: ref => {
          refs.infoWindow = ref
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
          refs.map.fitBounds(bounds)

          // close any info windows that were open for previous search
          this.setState({infoOpen: false})
          this.setState({markerIndex: null})

          // infowindow auto opens if only 1 result is present
          if (places.length === 1) {
            this.setState({infoOpen: true})
            this.setState({markerIndex: 0})
          }
        },
        handleMarkerClick: (index) => {
          var marker = this.state.markers[index]
          console.log('marker place', marker.place)
          if (!this.state.infoOpen || this.state.markerIndex !== index) {
            this.setState({infoOpen: true})
            this.setState({markerIndex: index})
          } else {
            this.setState({infoOpen: false})
            this.setState({markerIndex: null})
          }
        },
        handleSelectLocationClick: (placeId) => {
          var request = {placeId: placeId}

          if (refs.map) {
            var service = new window.google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED)
          }

          service.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              console.log('placeDetails', place)
              if (place.address_components) {
                var addressArr = place.address_components
                var countryCode = null
                addressArr.forEach(e => {
                  if (e.types.includes('country')) {
                    countryCode = e.short_name
                  }
                })
              }

              var openingHours = null
              if (place.opening_hours && place.opening_hours.periods) {
                openingHours = place.opening_hours.periods
              }
              this.setState({googlePlaceData: {
                placeId: place.place_id,
                countryCode: countryCode,
                name: place.name,
                address: place.formatted_address,
                openingHours: openingHours,
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng()
              }})
              // this.props.passLocationtoHOC(this.state.googlePlaceData)
              this.props.selectLocation(this.state.googlePlaceData)
            }
          })
        },
        closeInfoWindow: () => {
          this.setState({infoOpen: false})
          this.setState({markerIndex: null})
        }
      })
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap ref={props.onMapMounted} defaultZoom={15} center={props.center} onBoundsChanged={props.onBoundsChanged} style={{position: 'relative'}} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false}}>
    <CustomControl controlPosition={window.google.maps.ControlPosition.RIGHT_TOP}>
      <button onClick={() => props.toggleMap()} style={{width: '50px', height: '50px'}}>BACK</button>
    </CustomControl>
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
      <Marker ref={props.onMarkerMounted} key={index} position={marker.position} onClick={() => props.handleMarkerClick(index)}>
        {props.infoOpen && props.markerIndex === index &&
          <InfoWindow ref={props.onInfoWindowMounted} key={index} onCloseClick={props.closeInfoWindow}>
            <div>
              <h5>Name: {marker.place.name}</h5>
              <h5>Address: {marker.place.formatted_address}</h5>
              <h5>place_id: {marker.place.place_id}</h5>
              <button onClick={() => props.handleSelectLocationClick(marker.place.place_id)} >Select this location</button>
            </div>
          </InfoWindow>
      }
      </Marker>
    )}
  </GoogleMap>
)

class LocationMapHOC extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <LocationMap selectLocation={(obj) => this.props.selectLocation(obj)} toggleMap={() => this.props.toggleMap()} />
      </div>
    )
  }
}

export default LocationMapHOC
