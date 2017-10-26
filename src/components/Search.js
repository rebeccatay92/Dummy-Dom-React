import React, { Component } from 'react'
import { connect } from 'react-redux'
import { searchPlaces } from '../actions/searchActions'
import Result from './Result'

class Search extends Component {
  constructor () {
    super()
    this.state = {
      searchStr: ''
    }
  }

  handleChange (e) {
    this.setState({
      searchStr: e.target.value
    })
  }

  render () {
    return (
      <div>
        <h1>TESTING GOOGLE PLACES API</h1>
        <input type='search' onChange={(e) => this.handleChange(e)} />
        <button onClick={() => this.props.searchPlaces(this.state.searchStr)}>Search</button>
        {this.props.searchResults.map((result, i) => {
          return (
            <Result result={result} key={i} />
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    searchResults: state.searchResults
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchPlaces: (str) => {
      console.log(str)
      dispatch(searchPlaces(str))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
