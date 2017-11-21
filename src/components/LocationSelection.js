import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Radium from 'radium'
import GooglePlaceResult from './GooglePlaceResult'

const crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
var key = 'key=AIzaSyAxgvwjGHtDymECJveRuiwnult-2VfDwhA'
var placeSearch = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'


class LocationSelection extends Component {
  constructor (props) {
    super(props)
    let timeout // for debounce
    this.state = {
      search: '',
      results: [],
      selecting: false,
      selectedLocation: {}
    }
  }

  selectLocation (location) {
    this.props.selectLocation(location) // pass it up to createActivityForm googlePlaceData
    this.setState({selectedLocation: location}) //set intermediate state here as well
    this.setState({search: location.name}) // set search string
    this.setState({selecting: false}) // close results
  }

  handleChange (e, field) {
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
        console.log(json)
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
  }

  render () {
    return (
      <div>
        <form>
          <input type='text' autoComplete='off' placeholder='Search for a location' name='search' onChange={(e) => this.handleChange(e, 'search')} onKeyUp={() => this.customDebounce()} style={{ width: '300px', background: 'pink', border: 'none', borderBottom: '1px solid pink', outline: 'none', ':hover': {borderBottom: '1px solid black'} }} value={this.state.search} />
        </form>

        {this.state.selecting &&
        <div style={{width: '300px', maxHeight: '200px', overflow: 'scroll', background: 'white', position: 'fixed', zIndex: '2'}}>
          {this.state.results.map((indiv, i) => {
            return <GooglePlaceResult result={indiv} selectLocation={(location) => this.selectLocation(location)} key={i} />
          })}
        </div>
          }
      </div>
    )
  }
}

export default onClickOutside(Radium(LocationSelection))
