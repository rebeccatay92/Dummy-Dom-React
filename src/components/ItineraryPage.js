import React, { Component } from 'react'
import { connect } from 'react-redux'

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

const mapStateToProps = (state) => {
  return {
    itineraries: state.itineraryList
  }
}

export default connect(mapStateToProps)(compose(graphql(allItineraries))(ItineraryPage))
