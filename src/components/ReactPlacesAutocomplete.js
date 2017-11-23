import React, {Component} from 'react'

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

  // customDebounce () {
  //   var queryStr = this.state.search
  //   clearTimeout(this.timeout)
  //   this.timeout = setTimeout(() => {
  //     this.autocomplete(queryStr)
  //   }, 250)
  // }

  // autocomplete () {
  //   var service = new window.google.maps.places.AutocompleteService()
  //   service.getPlacePredictions({input: this.state.search}, function (predictions, status) {
  //     console.log(predictions, status)
  //   })
  // }

  initAutocomplete () {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    })

// Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input')
    var searchBox = new window.google.maps.places.SearchBox(input)
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input)

// Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds())
    })

    var markers = []
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces()

      if (places.length == 0) {
        return
      }

  // Clear out the old markers.
      markers.forEach(function (marker) {
        marker.setMap(null)
      })
      markers = []

  // For each place, get the icon, name and location.
      var bounds = new window.google.maps.LatLngBounds()
      places.forEach(function (place) {
        if (!place.geometry) {
          console.log('Returned place contains no geometry')
          return
        }
        var icon = {
          url: place.icon,
          size: new window.google.maps.Size(71, 71),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(17, 34),
          scaledSize: new window.google.maps.Size(25, 25)
        }

    // Create a marker for each place.
        markers.push(new window.google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }))

        if (place.geometry.viewport) {
      // Only geocodes have viewport.
          bounds.union(place.geometry.viewport)
        } else {
          bounds.extend(place.geometry.location)
        }
      })
      map.fitBounds(bounds)
    })
  }

  componentDidMount () {
    this.initAutocomplete()
  }

  render () {
    return (
      <div>
        <input id='pac-input' className='controls' type='text' placeholder='Search Box' />
        <div id='map' />
      </div>

    )
  }
}

export default ReactPlacesAutocomplete
