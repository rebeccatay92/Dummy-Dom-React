import React, { Component } from 'react'
import PlannerActivity from './PlannerActivity'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { addActivity, deleteActivity, hoverOutsidePlanner, plannerActivityHoverOverActivity } from '../actions/plannerActions'
import { addActivityToBucket, deleteActivityFromBucket } from '../actions/bucketActions'

const dateTarget = {
  drop (props, monitor) {
    // if (props.activities.filter(activity => activity.startDate === props.date).length === 0) {
      // let newActivity = Object.assign(monitor.getItem(), {startDate: props.date})
      // props.addActivity(newActivity)
      // props.deleteActivityFromBucket(monitor.getItem())
    // }
  },
  hover (props, monitor) {
    // if (props.activities.filter(activity => activity.startDate === props.date).length === 0) {
    //   if (monitor.getItemType() === 'plannerActivity') props.plannerActivityHoverOverActivity(0, monitor.getItem(), props.date)
    // }
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
    return (
      <div>
        <h2>Day {this.props.day}: {this.props.date}</h2>
        <hr />
        {connectDropTarget(<div style={{minHeight: isOver ? '10vh' : '2vh'}}>
          {this.props.activities.map((activity, i, array) => {
            return (
              <PlannerActivity itineraryId={this.props.itineraryId} draggable={this.props.draggable} activity={activity} key={activity.id} index={i} isLast={i === array.length - 1} />
            )
          })}
          <PlannerActivity itineraryId={this.props.itineraryId} activity={{date: this.props.date}} />
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

export default connect(null, mapDispatchToProps)(DropTarget(['activity', 'plannerActivity'], dateTarget, collect)(Date))
