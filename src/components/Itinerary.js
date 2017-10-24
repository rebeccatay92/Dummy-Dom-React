import React, { Component } from 'react'

class Itinerary extends Component {

  render () {
    return (
      <div style={{border: '1px solid black'}}>
        <h3>An itinerary, with id {this.props.itinerary.id}, and name {this.props.itinerary.name}</h3>
      </div>
    )
  }
}

export default Itinerary
