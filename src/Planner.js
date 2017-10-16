import React, { Component } from 'react'
import PlannerActivity from './PlannerActivity'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { addActivity, deleteActivity, hoverOutsidePlanner } from './actions/plannerActions'
import { addActivityToBucket, deleteActivityFromBucket } from './actions/bucketActions'

const plannerTarget = {
  drop (props, monitor) {
    if (props.activities.length === 0) {
      props.addActivity(monitor.getItem())
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

class Planner extends Component {
  constructor (props) {
    super(props)

    this.state = {
      draggable: false
    }
  }

  handleClick (activity) {
    this.props.deleteActivity(activity)
    this.props.addActivityToBucket(activity)
  }

  render () {
    const { connectDropTarget, isOver } = this.props
    let preview
    if (isOver && this.props.activities.length === 0) {
      preview = (
        <div style={{border: '10px solid green', height: '18vh'}} />
      )
    }
    return connectDropTarget(
      <div style={{minHeight: '12vh'}}>
        <button onClick={() => this.setState({draggable: !this.state.draggable})}>{this.state.draggable ? 'Rearrange Mode: On' : 'Rearrange Mode: Off'}</button>
        {this.props.activities.map((activity, i) => {
          return (
            <PlannerActivity draggable={this.state.draggable} activity={activity} key={activity.id} index={i} handleClick={(activity) => this.handleClick(activity)} />
          )
        })}
        {preview}
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

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget(['activity', 'plannerActivity'], plannerTarget, collect)(Planner))
