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
    this.props.toggleEventDropdown(event)
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
      <div style={{width: '145px', position: 'absolute', right: this.props.expandedEvent ? '590px' : '12px', top: '15px', backgroundColor: 'white', zIndex: 1, cursor: 'default', boxShadow: '0px 1px 5px 2px rgba(0, 0, 0, .2)'}}>
        <div style={{margin: '8px'}}>
          <span key='edit' onClick={() => this.props.toggleEditEvent()} style={{color: '#3C3A44', ':hover': {color: '#ed9fad'}}}>Edit Event</span>
        </div>
        <div style={{margin: '8px'}}>
          <span key='delete' onClick={() => this.deleteEvent()} style={{color: '#3C3A44', ':hover': {color: '#ed9fad'}}}>Delete Event</span>
        </div>
        <div style={{margin: '8px'}}>
          <span key='kissDom' onClick={() => alert('You son of a bitch')} style={{color: '#3C3A44', ':hover': {color: '#ed9fad'}}}>Kiss Dom</span>
        </div>
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
