import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'

import { graphql, compose } from 'react-apollo'
import { deleteActivity } from '../apollo/activity'
import { deleteFood } from '../apollo/food'
import { deleteFlightBooking } from '../apollo/flight'
import { deleteLandTransport } from '../apollo/landtransport'
import { deleteLodging } from '../apollo/lodging'
import { queryItinerary } from '../apollo/itinerary'

class EventDropdownMenu extends Component {
  handleClickOutside (event) {
    this.props.toggleEventDropdown()
  }

  deleteEvent () {
    const types = {
      Activity: 'deleteActivity',
      Food: 'deleteFood',
      Flight: 'deleteFlightBooking',
      LandTransport: 'deleteLandTransport',
      Lodging: 'deleteLodging'
    }

    console.log(this.props);

    this.props[types[this.props.event.type]]({
      variables: {
        id: this.props.event.modelId
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })
  }

  render () {
    return (
      <div style={{width: '180px', height: 'auto', position: 'absolute', right: '12px', top: '45px', backgroundColor: 'white', zIndex: 1, cursor: 'default', boxShadow: '0px 1px 5px 2px rgba(0, 0, 0, .2)'}}>
        <span onClick={() => this.deleteEvent()} style={{color: '#3C3A44', ':hover': {color: '#ed9fad'}}}>Delete</span>
      </div>
    )
  }
}

export default compose(
  graphql(deleteFood, { name: 'deleteFood' }),
  graphql(deleteActivity, { name: 'deleteActivity' }),
  graphql(deleteFlightBooking, { name: 'deleteFlightBooking' }),
  graphql(deleteLodging, { name: 'deleteLodging' }),
  graphql(deleteLandTransport, { name: 'deleteLandTransport' })
)(onClickOutside(Radium(EventDropdownMenu)))
