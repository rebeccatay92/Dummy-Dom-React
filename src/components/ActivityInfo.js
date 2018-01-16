import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import { graphql, compose } from 'react-apollo'

import { updateActivity } from '../apollo/activity'
import { updateFlightBooking } from '../apollo/flight'
import { updateLodging } from '../apollo/lodging'
import { updateLandTransport } from '../apollo/landtransport'
import { updateFood } from '../apollo/food'

import { queryItinerary } from '../apollo/itinerary'

class ActivityInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editing: false,
      value: this.props.value,
      newValue: this.props.value
    }

    this.toggleDraggable = this.props.toggleDraggable
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
        newValue: nextProps.value
      })
    }
  }

  render () {
    if (this.state.editing) {
      return (
        <input autoFocus onKeyDown={(e) => this.handleKeyDown(e)} style={{position: 'relative', top: '-5px', width: '223px'}} name={this.props.name} onChange={(e) => this.setState({ newValue: e.target.value })} value={this.state.newValue} />
      )
    }
    if (!this.props.value) {
      return (
        <span style={{opacity: '0', fontSize: '1px'}}>a</span>
      )
    }
    return (
      <span onClick={() => this.handleClick()} title={this.state.value} style={{display: 'inline-block', height: '18px', maxWidth: '223px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{this.state.value}</span>
    )
  }

  handleClick () {
    this.setState({
      editing: true
    })

    // this.toggleDraggable()
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) {
      this.handleEdit()
    }
  }

  handleClickOutside (event) {
    if (event.target.localName === 'input') return
    this.setState({
      editing: false,
      newValue: this.state.value
    })
  }

  handleEdit (e, element) {
    this.setState({
      editing: false
    })

    if (this.state.newValue === this.props.value) {
      return
    }

    this.setState({
      value: this.state.newValue
    })

    const isTime = this.props.name === 'startTime' || this.props.name === 'endTime'
    let unix
    if (isTime) {
      var hours = this.state.newValue.split(':')[0]
      var mins = this.state.newValue.split(':')[1]
      unix = (hours * 60 * 60) + (mins * 60)
    }

    const update = {
      Activity: this.props.updateActivity,
      Flight: this.props.updateFlightBooking,
      Lodging: this.props.updateLodging,
      Food: this.props.updateFood,
      LandTransport: this.props.updateLandTransport
    }

    update[this.props.type]({
      variables: {
        id: this.props.activityId,
        [this.props.name]: isTime ? unix : this.state.newValue
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
  graphql(updateLandTransport, { name: 'updateLandTransport' }),
  graphql(updateLodging, { name: 'updateLodging' }),
  graphql(updateFood, { name: 'updateFood' })
))(onClickOutside(ActivityInfo))
