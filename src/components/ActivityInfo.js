import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { updateActivity, updateFlight, updateFood, updateLodging, updateTransport } from '../apollo/activity'
import { queryItinerary } from '../apollo/itinerary'

class ActivityInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editing: false,
      value: this.props.value
    }
  }

  render () {
    if (this.state.editing) {
      return (
        <form onSubmit={(e) => this.handleEdit(e)} style={{display: 'block'}}>
          <input name={this.props.name} onChange={(e) => this.setState({ value: e.target.value })} value={this.state.value} />
          <button type='submit'>ok</button>
        </form>
      )
    }
    return (
      <span onClick={() => this.setState({editing: false})}>{this.state.value}</span>
    )
  }

  handleEdit (e, element) {
    e.preventDefault()

    this.setState({
      editing: false
    })

    if (this.state.value === this.props.value) {
      return
    }

    this.props.updateActivity({
      variables: {
        id: this.props.activity.id,
        [this.props.name]: this.state.value
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })
  }
}

export default ActivityInfo
