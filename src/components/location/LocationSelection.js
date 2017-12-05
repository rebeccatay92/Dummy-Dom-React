import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Radium from 'radium'
import GooglePlaceResult from './GooglePlaceResult'

import { locationSelectionInputStyle, locationDropdownStyle } from '../../Styles/styles'

const crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
var key = 'key=AIzaSyDwlTicqOxDlB2u3MhiEusUJyo_QQy-MZU'
var placeSearch = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'


class LocationSelection extends Component {
  constructor (props) {
    super(props)
    let timeout // for debounce
    this.state = {
      search: '',
      results: [],
      selecting: false,
      selectedLocation: {},
      marginTop: 240
    }
  }

  selectLocation (location) {
    this.props.selectLocation(location) // pass it up to createActivityForm googlePlaceData
    this.setState({selectedLocation: location}) // set intermediate state here as well
    this.setState({search: location.name}) // set search string
    this.setState({selecting: false}) // close results
  }

  resizeTextArea () {
    let locationInput = document.querySelector('#locationInput')
    let initialClientHeight = locationInput.clientHeight
    locationInput.style.height = 'auto'
    // console.log(locationInput.style.height);
    // locationInput.style.height = locationInput.scrollHeight + 'px'
    console.log(locationInput.clientHeight, locationInput.scrollHeight);
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
    // console.log('form submitted', this.state.search)
    this.setState({results: []}) // resets state of search results
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
    if (this.state.selectedLocation.name) {
      this.setState({search: this.state.selectedLocation.name})
    } else {
      this.setState({search: ''})
    }
    this.resizeTextArea()
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <form>
          <textarea id='locationInput' className='left-panel-input' rows='1' autoComplete='off' placeholder='Input Location' name='search' onChange={(e) => this.handleChange(e, 'search')} onKeyUp={() => this.customDebounce()} style={locationSelectionInputStyle(this.state.marginTop)} value={this.state.search} />
          <i className='material-icons'>place</i>
        </form>

        {this.state.selecting &&
        <div style={locationDropdownStyle}>
          {this.state.results.map((indiv, i) => {
            return <GooglePlaceResult result={indiv} selectLocation={(location) => this.selectLocation(location)} key={i} />
          })}
        </div>
          }
      </div>
    )
  }

  componentDidMount () {
    this.resizeTextArea()
  }
}

export default onClickOutside(Radium(LocationSelection))
