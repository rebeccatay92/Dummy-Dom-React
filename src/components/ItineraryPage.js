import React, { Component } from 'react'
import { connect } from 'react-redux'

import { graphql, compose } from 'react-apollo'
import { allItineraries } from '../apollo/itinerary'
// import { initializeItineraries } from '../actions/itineraryActions'

import CreateItineraryForm from './CreateItineraryForm'
import Itinerary from './Itinerary'

class ItineraryPage extends Component {

  render () {
    if (this.props.data.loading) return <p>loading</p>
    return (
      <div>
        <h1>ITINERARY PAGE</h1>
        <CreateItineraryForm />
        {/* {this.props.itineraries.map(itinerary => {
          return (
            <Itinerary itinerary={itinerary} key={itinerary.id} />
          )
        })} */}
        {this.props.data.allItineraries.map(itinerary => {
          return (
            <Itinerary itinerary={itinerary} key={itinerary.id} />
          )
        })}
      </div>
    )
  }

  // componentDidUpdate () {
  //   if (!this.props.data.loading && !this.state.initialized) {
  //     this.props.initializeItineraries(this.props.data.allItineraries)
  //     this.setState({
  //       initialized: true
  //     })
  //   }
  // }
}

const mapStateToProps = (state) => {
  return {
    itineraries: state.itineraryList
  }
}

export default connect(mapStateToProps)(compose(graphql(allItineraries))(ItineraryPage))
