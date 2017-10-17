import React, { Component } from 'react'
import PlannerActivity from './PlannerActivity'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { addActivity, deleteActivity, hoverOutsidePlanner } from '../actions/plannerActions'
import { addActivityToBucket, deleteActivityFromBucket } from '../actions/bucketActions'

const dateTarget = {
  drop (props, monitor) {
    if (props.activities.filter(activity => activity.startDate === props.date).length === 0) {
      let newActivity = Object.assign(monitor.getItem(), {startDate: props.date})
      props.addActivity(newActivity)
      props.deleteActivityFromBucket(monitor.getItem())
    }
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

class Date extends Component {
  render () {
    const { connectDropTarget, isOver } = this.props
    let preview
    if (isOver && this.props.activities.filter(activity => activity.startDate === this.props.date).length === 0) {
      preview = (
        <div style={{border: '1px dashed green', height: '12vh'}} />
      )
    }
    return connectDropTarget(
      <div>
        <h2>{this.props.date}</h2>
        <hr />
        <div style={{minHeight: '12vh'}}>
          {this.props.activities.filter(activity => activity.startDate === this.props.date).map((activity, i) => {
            return (
              <PlannerActivity draggable={this.props.draggable} activity={activity} key={activity.id} index={i} />
            )
          })}
          {preview}
        </div>
      </div>
    )
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isOver === !this.props.isOver) {
      if (!nextProps.isOver) this.props.hoverOutsidePlanner()
    }
  }
}

const mapStateToProps = (state) => {
  return {
    activities: state.plannerActivities
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addActivity: (activity) => {
      dispatch(addActivity(activity))
    },
    deleteActivity: (activity) => {
      dispatch(deleteActivity(activity))
    },
    addActivityToBucket: (activity) => {
      dispatch(addActivityToBucket(activity))
    },
    deleteActivityFromBucket: (activity) => {
      dispatch(deleteActivityFromBucket(activity))
    },
    hoverOutsidePlanner: () => {
      dispatch(hoverOutsidePlanner())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget(['activity', 'plannerActivity'], dateTarget, collect)(Date))
