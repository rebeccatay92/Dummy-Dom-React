import React, { Component } from 'react'
import PlannerActivity from './PlannerActivity'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { addActivity, deleteActivity, hoverOutsidePlanner, plannerActivityHoverOverActivity } from '../actions/plannerActions'
import { addActivityToBucket, deleteActivityFromBucket } from '../actions/bucketActions'

const dateTarget = {
  drop (props, monitor) {
    if (props.activities.filter(activity => activity.startDate === props.date).length === 0) {
      let newActivity = Object.assign(monitor.getItem(), {startDate: props.date})
      props.addActivity(newActivity)
      props.deleteActivityFromBucket(monitor.getItem())
    }
  },
  hover (props, monitor) {
    if (props.activities.filter(activity => activity.startDate === props.date).length === 0) {
      if (monitor.getItemType() === 'plannerActivity') props.plannerActivityHoverOverActivity(0, monitor.getItem(), props.date)
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
    if (this.props.activities.filter(activity => activity.startDate === this.props.date).length === 0) {
      preview = (
        <div style={{border: '1px dashed black', height: '10vh', backgroundColor: isOver ? 'yellow' : 'white'}}>
          <h4 style={{textAlign: 'center', fontStyle: 'italic'}}>Drag Activities Here</h4>
        </div>
      )
    }
    return (
      <div>
        <h2>Day {this.props.day}: {this.props.date}</h2>
        <hr />
        {connectDropTarget(<div style={{minHeight: isOver ? '10vh' : '2vh'}}>
          {this.props.activities.filter(activity => activity.startDate === this.props.date).map((activity, i) => {
            return (
              <PlannerActivity draggable={this.props.draggable} activity={activity} key={activity.id} index={i} />
            )
          })}
          {preview}
        </div>)}
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
    },
    plannerActivityHoverOverActivity: (index, activity, date) => {
      dispatch(plannerActivityHoverOverActivity(index, activity, date))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget(['activity', 'plannerActivity'], dateTarget, collect)(Date))
