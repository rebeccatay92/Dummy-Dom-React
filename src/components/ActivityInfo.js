import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'

import { updateActivity} from '../apollo/activity'
import { updateFlightBooking } from '../apollo/flight'
import { updateLodging } from '../apollo/lodging'
import { updateTransport } from '../apollo/transport'
import { updateFood } from '../apollo/food'

import { queryItinerary } from '../apollo/itinerary'

class ActivityInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editing: false,
      value: this.props.value
    }

    this.toggleDraggable = this.props.toggleDraggable
  }

  render () {
    if (this.state.editing) {
      return (
        <form onSubmit={(e) => this.handleEdit(e)} style={{display: 'inline'}}>
          <input name={this.props.name} onChange={(e) => this.setState({ value: e.target.value })} value={this.state.value} />
          <button type='submit'>ok</button>
        </form>
      )
    }
    if (!this.props.value) return (
      <span style={{opacity: '0', fontSize: '1px'}}>a</span>
    )
    return (
      <span onClick={() => this.handleClick()}>{this.state.value}</span>
    )
  }

  handleClick () {
    this.setState({
      editing: true
    })

    this.toggleDraggable()
  }

  handleEdit (e, element) {
    e.preventDefault()

    this.setState({
      editing: false
    })

    if (this.state.value === this.props.value) {
      return
    }

    const update = {
      Activity: this.props.updateActivity,
      Flight: this.props.updateFlightBooking,
      Lodging: this.props.updateLodging,
      Food: this.props.updateFood,
      Transport: this.props.updateTransport
    }

    update[this.props.type]({
      variables: {
        id: this.props.activityId,
        [this.props.name]: this.state.value
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })
  }
}

export default (compose(
  graphql(updateActivity, { name: 'updateActivity' }),
  graphql(updateFlightBooking, { name: 'updateFlightBooking' }),
  graphql(updateTransport, { name: 'updateTransport' }),
  graphql(updateLodging, { name: 'updateLodging' }),
  graphql(updateFood, { name: 'updateFood' })
))(ActivityInfo)
