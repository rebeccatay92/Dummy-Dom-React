import React, { Component } from 'react'
import airports from '../data/airports.json'

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
    var cityCodes = []
    var cities = []

    // extract all possible cities
    this.props.results.forEach(e => {
      if (e.cityCode && !cityCodes.includes(e.cityCode)) {
        cityCodes.push(e.cityCode)
        cities.push({name: e.city, cityCode: e.cityCode, country: e.country})
      }
    })

    var airportsInCities = airports.filter(row => {
      if (cityCodes.includes(row.cityCode)) {
        return row
      }
    })

    var airportsWithoutCities = this.props.results.filter(row => {
      if (!row.cityCode) return row
    })

    return (
      <div>
        {cities.map((city, i) => {
          var cityCode = city.cityCode
          return <div key={`city${i}`}>
            <h5 key={`cityrow${i}`} onClick={() => this.handleClick(city)}>City: {city.name}, {city.cityCode}, {city.country}</h5>

            {airportsInCities.map((airport, i) => {
              console.log('city airport', airport)
              if (airport.cityCode === cityCode) {
                return <h5 key={`cityairportrow${i}`} onClick={() => this.handleClick(airport)}>--> Airport: {airport.name}, {airport.city}, {airport.iata}</h5>
              }
            })}
          </div>
        })}
        {airportsWithoutCities.map((result, i) => {
          return <h5 key={`airportrow${i}`} onClick={() => this.handleClick(result)}>Airport: {result.name}, {result.city}, {result.iata}</h5>
        })}
      </div>
    )
  }
}

export default AirportResults
