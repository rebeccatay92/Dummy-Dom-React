import React, { Component } from 'react'
import BucketActivity from './BucketActivity'
import { connect } from 'react-redux'
import { initializeBucket } from '../actions/bucketActions'
import { gql, graphql } from 'react-apollo'

class BucketList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      initialized: false
    }
  }
  render () {
    return (
      <div>
        {this.props.activities.map(activity => {
          return (
            <BucketActivity activity={activity} key={activity.id} />
          )
        })}
      </div>
    )
  }

  componentDidUpdate () {
    if (!this.props.data.loading && !this.state.initialized) {
      this.props.initializeBucket(this.props.data.allActivities)
      this.setState({
        initialized: true
      })
    }
  }
}

const mapStateToProps = (state) => {
  return {
    activities: state.bucketList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeBucket: (activities) => {
      dispatch(initializeBucket(activities))
    }
  }
}

const query = gql`
  {
    allActivities{
      id
      name
      location {
        name
      }
    }
  }
`

export default connect(mapStateToProps, mapDispatchToProps)(graphql(query)(BucketList))
