import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Radium from 'radium'
import GooglePlaceResult from './GooglePlaceResult'
import LocationMapHOC from './LocationMapHOC'

import { locationSelectionInputStyle, locationDropdownStyle, locationMapContainerStyle } from '../../Styles/styles'

const crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
var key = `key=${process.env.REACT_APP_GOOGLE_API_KEY}`
var placeSearch = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'

class LocationSelection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      search: '',
      results: [],
      selecting: false,
      mapIsOpen: false
    }
  }

  selectLocation (location) {
    // stringify opening hours here
    if (location.openingHours) {
      location.openingHours = JSON.stringify(location.openingHours)
    }
    this.setState({search: location.name})
    this.setState({selecting: false})
    this.setState({mapIsOpen: false})
    this.props.selectLocation(location) // pass it up to createActivityForm googlePlaceData
  }

  resizeTextArea () {
    let locationInput = document.querySelector('#locationInput')
    let initialClientHeight = locationInput.clientHeight
    locationInput.style.height = 'auto'
    // console.log(locationInput.style.height);
    // locationInput.style.height = locationInput.scrollHeight + 'px'
    // console.log(locationInput.clientHeight, locationInput.scrollHeight);
    if (locationInput.clientHeight < locationInput.scrollHeight) {
      locationInput.style.height = locationInput.scrollHeight + 'px'
      if (locationInput.clientHeight < locationInput.scrollHeight) {
        locationInput.style.height = (locationInput.scrollHeight * 2 - locationInput.clientHeight) + 'px'
      }
    }
    if (initialClientHeight < locationInput.clientHeight) {
      this.setState({
        marginTop: this.state.marginTop - 51
      })
    } else if (initialClientHeight > locationInput.clientHeight) {
      this.setState({
        marginTop: this.state.marginTop + 51
      })
    }
  }

  handleChange (e, field) {
    this.resizeTextArea()
    this.setState({
      [field]: e.target.value
    })
    if (field === 'search') {
      this.setState({selecting: true})
    }
  }

  searchPlaces (queryStr) {
    this.setState({results: []})
    var query = `&query=${queryStr}`
    var urlPlaceSearch = crossOriginUrl + placeSearch + key + query
    if (queryStr) {
      fetch(urlPlaceSearch)
      .then(response => {
        return response.json()
      }).then(json => {
        console.log('results', json.results)
        this.setState({results: json.results})
      }).catch(err => {
        console.log('err', err)
      })
    } // close if
  }

  customDebounce () {
    var queryStr = this.state.search
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.searchPlaces(queryStr) // wrap api call inside anonymous fxn, else the async nature will still keep firing
    }, 250)
  }

  handleClickOutside () {
    this.setState({selecting: false})
    // even if props is empty, currentLocation still exists {}
    if (this.props.currentLocation.name) {
      // console.log('currentLocation exists', this.props.currentLocation)
      this.setState({search: this.props.currentLocation.name})
    } else {
      // console.log('currentLocation doesnt exist', this.props.currentLocation)
      this.setState({search: ''})
    }

    this.resizeTextArea()
  }

  toggleMap () {
    this.setState({mapIsOpen: !this.state.mapIsOpen})
  }

  componentDidMount () {
    this.resizeTextArea()
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <textarea id='locationInput' className='left-panel-input' rows='1' autoComplete='off' placeholder='Input Location' name='search' onChange={(e) => this.handleChange(e, 'search')} onKeyUp={() => this.customDebounce()} style={locationSelectionInputStyle(0)} value={this.state.search} />
        <i className='material-icons' onClick={() => this.toggleMap()} style={{fontSize: '50px', cursor: 'pointer'}}>place</i>

        {this.state.selecting &&
        <div style={locationDropdownStyle}>
          {this.state.results.map((indiv, i) => {
            return <GooglePlaceResult result={indiv} selectLocation={(location) => this.selectLocation(location)} key={i} />
          })}
        </div>
        }

        {this.state.mapIsOpen &&
        <div style={locationMapContainerStyle}>
          <LocationMapHOC selectLocation={(obj) => this.selectLocation(obj)} toggleMap={() => this.toggleMap()} currentLocation={this.props.currentLocation} />
        </div>
        }
      </div>
    )
  }
}

export default onClickOutside(Radium(LocationSelection))
