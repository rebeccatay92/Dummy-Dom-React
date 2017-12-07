import React, { Component } from 'react'

class AirportResults extends Component {
  constructor (props) {
    super(props)
    // this.state = {
    //   cities: []
    // }
  }
  // componentDidMount () {
  //   var results = this.props.results
  //   console.log('results', results)
  //
  //   var cities = []
  //
  //   results.forEach(e => {
  //     if (e.cityCode) {
  //       cities.push({city: e.city, cityCode: e.cityCode, country: e.country})
  //     }
  //   })
  //   this.setState({cities: cities})
  // }

  handleClick (cityOrAirport) {
    console.log('clicked', cityOrAirport)
    // only airport rows have id
    // city obj was self created, has no id
    if (cityOrAirport.id) {
      cityOrAirport.type = 'airport'
    } else {
      cityOrAirport.type = 'city'
    }
    this.props.selectLocation(cityOrAirport)
  }
  // NEEDS CITY/AIRPORT LISTING, SELECT AIRPORT, CLICK OUTSIDE, HOVER LOGIC
  render () {
    var cities = []
    var cityCodes = []
    this.props.results.forEach(e => {
      if (e.cityCode && !cityCodes.includes(e.cityCode)) {
        cityCodes.push(e.cityCode)
        cities.push({name: e.city, cityCode: e.cityCode, country: e.country})
      }
    })

    return (
      <div>
        {cities.map((e, i) => {
          return <h5 key={'airportcity' + i} onClick={() => this.handleClick(e)}>City: {e.name}, {e.cityCode}, {e.country}</h5>
        })}
        {this.props.results.map((e, i) => {
          return <h5 key={'airport' + i} onClick={() => this.handleClick(e)}>Airport: {e.name}, {e.city}, {e.iata}</h5>
        })}
      </div>
    )
  }
}

export default AirportResults
