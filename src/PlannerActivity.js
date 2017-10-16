import React, { Component } from 'react'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, addActivity, plannerActivityHoverOverActivity } from './actions/plannerActions'
import { deleteActivityFromBucket, addActivityToBucket } from './actions/bucketActions'
import { connect } from 'react-redux'

const plannerActivitySource = {
  beginDrag (props) {
    return {
      id: props.activity.id,
      name: props.activity.name,
      city: props.activity.city,
      draggable: props.draggable
    }
  },
  endDrag (props, monitor) {
    if (!monitor.didDrop()) {
      props.addActivityToBucket(props.activity)
    }
  },
  canDrag (props) {
    if (props.draggable) return true
    else return false
  }
}

const plannerActivityTarget = {
  hover (props, monitor, component) {
    if (monitor.getItemType() === 'activity') props.hoverOverActivity(props.index)
    else if (monitor.getItemType() === 'plannerActivity') props.plannerActivityHoverOverActivity(props.index, monitor.getItem())
  },
  drop (props, monitor) {
    props.addActivity(monitor.getItem(), props.index)
    if (monitor.getItemType() === 'activity') {
      props.deleteActivityFromBucket(monitor.getItem())
    }
  }
}

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

function collectSource (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
  }
}

class PlannerActivity extends Component {
  render () {
    const { connectDropTarget, connectDragSource } = this.props
    return connectDragSource(connectDropTarget(<div style={{opacity: '1', marginBottom: '1vh', cursor: this.props.draggable ? 'move' : 'default', minHeight: '12vh', border: this.props.activity.id ? '1px solid black' : '10px solid green'}} key={this.props.activity.id}>
      <h3>{this.props.activity.name}</h3>
      <p>{this.props.activity.city}</p>
      {/* {
        !this.props.activity.id ||
        <button style={{marginBottom: '1vh'}} onClick={() => this.props.handleClick(this.props.activity)}>Remove</button>
      } */}
    </div>))
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hoverOverActivity: (index) => {
      dispatch(hoverOverActivity(index))
    },
    addActivity: (activity, index) => {
      dispatch(addActivity(activity, index))
    },
    deleteActivityFromBucket: (activity) => {
      dispatch(deleteActivityFromBucket(activity))
    },
    plannerActivityHoverOverActivity: (index, activity) => {
      dispatch(plannerActivityHoverOverActivity(index, activity))
    },
    addActivityToBucket: (activity) => {
      dispatch(addActivityToBucket(activity))
    }
  }
}

export default connect(null, mapDispatchToProps)(DragSource('plannerActivity', plannerActivitySource, collectSource)(DropTarget(['activity', 'plannerActivity'], plannerActivityTarget, collectTarget)(PlannerActivity)))
