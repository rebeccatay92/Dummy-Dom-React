import React, { Component } from 'react'
import GooglePlaceResult from './GooglePlaceResult'
import onClickOutside from 'react-onclickoutside'
import Radium from 'radium'

import { locationSelectionInputStyle, locationDropdownStyle } from '../../Styles/styles'

const crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
var key = `key=${process.env.REACT_APP_GOOGLE_API_KEY}`
var placeSearch = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'

class LocationSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      search: '',
      selecting: false,
      results: []
    }
  }

  handleChange (e) {
    this.setState({search: e.target.value})
    this.setState({selecting: true})
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
      this.searchPlaces(queryStr)
    }, 500)
  }

  selectLocation (details) {
    this.setState({selecting: false, results: []})
    this.setState({search: details.name})
    this.props.selectLocation(details)
  }

  handleClickOutside () {
    this.setState({selecting: false})
    // even if props is empty, currentLocation still exists {}
    if (this.props.currentLocation.name) {
      this.setState({search: this.props.currentLocation.name})
    } else {
      this.setState({search: ''})
    }
    // this.resizeTextArea()
  }

  // resizeTextArea () {
  //   let locationInput = document.querySelector('#locationInput')
  //   let initialClientHeight = locationInput.clientHeight
  //   locationInput.style.height = 'auto'
  //   // console.log(locationInput.style.height);
  //   // locationInput.style.height = locationInput.scrollHeight + 'px'
  //   // console.log(locationInput.clientHeight, locationInput.scrollHeight);
  //   if (locationInput.clientHeight < locationInput.scrollHeight) {
  //     locationInput.style.height = locationInput.scrollHeight + 'px'
  //     if (locationInput.clientHeight < locationInput.scrollHeight) {
  //       locationInput.style.height = (locationInput.scrollHeight * 2 - locationInput.clientHeight) + 'px'
  //     }
  //   }
  //   if (initialClientHeight < locationInput.clientHeight) {
  //     this.setState({
  //       marginTop: this.state.marginTop - 51
  //     })
  //   } else if (initialClientHeight > locationInput.clientHeight) {
  //     this.setState({
  //       marginTop: this.state.marginTop + 51
  //     })
  //   }
  // }

  // componentDidMount () {
  //   this.resizeTextArea()
  // }
  
  componentWillReceiveProps (nextProps) {
    if (nextProps.currentLocation !== this.props.currentLocation) {
      this.setState({search: nextProps.currentLocation.name})
    }
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <textarea key='location' id='locationInput' className='left-panel-input' rows='1' autoComplete='off' name='search' value={this.state.search} placeholder={this.props.placeholder} onChange={(e) => this.handleChange(e)} onKeyUp={() => this.customDebounce()} style={locationSelectionInputStyle(0)} />
        <i className='material-icons' onClick={() => this.props.toggleMap()} style={{fontSize: '50px', cursor: 'pointer'}}>place</i>

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
}

export default onClickOutside(Radium(LocationSearch))
