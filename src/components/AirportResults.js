import React, { Component } from 'react'

class AirportResults extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount () {
    console.log(this.props.results)
  }
  // NEEDS CITY/AIRPORT LISTING, SELECT AIRPORT, CLICK OUTSIDE, HOVER LOGIC
  render () {
    return (
      <div>
        {this.props.results.map((result, i) => {
          return <h5 key={'airportResult' + i}>{result.name}</h5>
        })
        }
      </div>
    )
  }
}

export default AirportResults
