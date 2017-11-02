import React, { Component } from 'react'

import { graphql, compose } from 'react-apollo'
import { allItineraries } from '../apollo/itinerary'

import CreateItineraryForm from './CreateItineraryForm'
import Itinerary from './Itinerary'

class ItineraryPage extends Component {

  render () {
    if (this.props.data.loading) return <p>loading</p>
    return (
      <div>
        <h1>ITINERARY PAGE</h1>
        <CreateItineraryForm />
        {this.props.data.allItineraries.map(itinerary => {
          return (
            <Itinerary itinerary={itinerary} key={itinerary.id} />
          )
        })}
      </div>
    )
  }
}

export default compose(graphql(allItineraries))(ItineraryPage)
