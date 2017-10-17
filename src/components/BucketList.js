import React, { Component } from 'react'
import BucketActivity from './BucketActivity'
import { connect } from 'react-redux'

class BucketList extends Component {
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
}

const mapStateToProps = (state) => {
  return {
    activities: state.bucketList
  }
}

export default connect(mapStateToProps)(BucketList)
