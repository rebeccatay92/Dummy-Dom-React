import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { columnValueContainerStyle, expandEventIconStyle } from '../Styles/styles'

import { updateActivity } from '../apollo/activity'
import { updateFlightBooking } from '../apollo/flight'
import { updateLodging } from '../apollo/lodging'
import { updateLandTransport } from '../apollo/landtransport'
import { updateFood } from '../apollo/food'

import { queryItinerary } from '../apollo/itinerary'

const columnValues = {
  'Price': 'cost',
  'Booking Status': 'bookingStatus',
  'Booking Platform': 'bookedThrough',
  'Notes': 'notes'
}

const flightBookingOrInstance = {
  Price: 'FlightBooking',
  'Booking Status': 'FlightBooking',
  'Booking Platform': 'FlightBooking',
  Notes: 'FlightInstance'
}

class PlannerColumnValue extends Component {
  constructor (props) {
    super(props)

    let value

    if (!props.expandedEvent) value = props.activity[props.activity.type][columnValues[props.column]]

    if (props.activity.type === 'Flight') value = props.activity[props.activity.type][flightBookingOrInstance[props.column]][columnValues[props.column]]

    this.state = {
      editing: false,
      value: value,
      newValue: value
    }
  }

  componentWillReceiveProps (nextProps) {
    let value
    value = nextProps.activity[nextProps.activity.type][columnValues[nextProps.column]]
    if (nextProps.activity.type === 'Flight') value = nextProps.activity[nextProps.activity.type][flightBookingOrInstance[nextProps.column]][columnValues[nextProps.column]]

    if (this.state.value !== value) {
      this.setState({
        value: value,
        newValue: value
      })
    }
  }

  handleClickOutside (event) {
    this.setState({
      newValue: this.state.value,
      editing: false
    })
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) {
      this.handleEdit()
    }
  }

  handleEdit () {
    this.setState({
      editing: false
    })

    if (this.state.value === this.state.newValue) return

    this.setState({
      value: this.state.newValue
    })

    const update = {
      Activity: this.props.updateActivity,
      Flight: this.props.updateFlightBooking,
      Lodging: this.props.updateLodging,
      Food: this.props.updateFood,
      LandTransport: this.props.updateLandTransport
    }

    update[this.props.activity.type]({
      variables: {
        id: this.props.activity.modelId,
        [columnValues[this.props.column]]: this.state.newValue
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })
  }

  handleClick () {
    if (this.props.column === 'Booking Status') return
    this.setState({
      editing: true
    })
  }

  render () {
    if (this.props.expandedEvent) {
      return (
        <td style={{position: 'relative'}}>
          {this.props.isLast && this.props.expandedEvent && (
            <i key='eventOptions' className='material-icons' style={expandEventIconStyle} onClick={() => this.props.expandEvent()}>expand_less</i>
          )}
        </td>
      )
    }
    const value = this.renderInfo()
    return (
      <td colSpan={this.props.column === 'Notes' ? 4 : 1} style={columnValueContainerStyle(this.props.column)}>
        {!this.state.editing && value !== '' && <span className={'activityInfo ' + columnValues[this.props.column]} onClick={() => this.handleClick()} style={{padding: '1px', width: this.props.column === 'Notes' ? '95%' : '75%', display: 'inline-block', wordWrap: 'break-word'}}>
          {value}
        </span>}
        {this.state.editing && this.props.column !== 'Notes' && <input autoFocus type='text' style={{width: '70%'}} value={this.state.newValue} onChange={(e) => this.setState({newValue: e.target.value})} onKeyDown={(e) => this.handleKeyDown(e)} />}
        {this.state.editing && this.props.column === 'Notes' && <textarea autoFocus style={{width: '90%', resize: 'none'}} value={this.state.newValue} onChange={(e) => this.setState({newValue: e.target.value})} onKeyDown={(e) => this.handleKeyDown(e)} />}
        {this.props.isLast && this.props.hover && !this.props.expandedEvent && !this.props.activity.dropzone && <i key='eventOptions' className='material-icons' style={expandEventIconStyle} onClick={() => this.props.expandEvent()}>expand_more</i>}
      </td>
    )
  }

  renderInfo () {
    const start = !this.props.activity.dropzone && (this.props.activity.start || typeof this.props.activity.start !== 'boolean')
    let value = this.state.value
    switch (this.props.column) {
      case 'Notes':
        if (start) return value || ''
        else return ''
      case 'Price':
        if (this.props.activity.type === 'Flight' && this.props.firstInFlightBooking && start) {
          return value || ''
        } else if (this.props.activity.type === 'Flight') {
          return ''
        } else {
          if (start) return value || ''
          else return ''
        }
      case 'Booking Status':
        if (start) return value === false ? 'Not Booked' : 'Booked'
        else return ''
      case 'Booking Platform':
        if (start) return value
        else return ''
      default:
        return value
    }
  }
}

export default compose(
  graphql(updateActivity, { name: 'updateActivity' }),
  graphql(updateFlightBooking, { name: 'updateFlightBooking' }),
  graphql(updateLandTransport, { name: 'updateLandTransport' }),
  graphql(updateLodging, { name: 'updateLodging' }),
  graphql(updateFood, { name: 'updateFood' })
)(onClickOutside(Radium(PlannerColumnValue)))
