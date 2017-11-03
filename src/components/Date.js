import React, { Component } from 'react'
import PlannerActivity from './PlannerActivity'
import { graphql } from 'react-apollo'
import { changingLoadSequence } from '../apollo/activity'
// import { queryItinerary } from '../apollo/itinerary'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { dropActivity, deleteActivity, hoverOutsidePlanner, plannerActivityHoverOverActivity } from '../actions/plannerActions'
import { addActivityToBucket, deleteActivityFromBucket } from '../actions/bucketActions'

const dateTarget = {
  drop (props, monitor) {
    // if (props.activities.filter(activity => activity.startDate === props.date).length === 0) {
      // let newActivity = Object.assign(monitor.getItem(), {startDate: props.date})
      // props.dropActivity(newActivity)
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

class DateBox extends Component {
  render () {
    const { connectDropTarget, isOver } = this.props
    // if (this.props.activities.length > 0) console.log(this.props.activities)
    return (
      <div>
        <h2 style={{display: 'inline-block', margin: '0 0 0 1vw'}}>Day {this.props.day} </h2>
        <span style={{fontSize: '12pt', display: 'inline-block', position: 'relative', top: '-2px', marginLeft: '0.5vw'}}>{new Date(this.props.date).toDateString().toUpperCase()}</span>
        <hr style={{marginBottom: '2vh'}} />
        {connectDropTarget(<div style={{minHeight: isOver ? '10vh' : '2vh'}}>
          {this.props.activities.map((activity, i, array) => {
            return (
              <PlannerActivity itineraryId={this.props.itineraryId} draggable={this.props.draggable} activity={activity} key={i} index={i} isLast={i === array.length - 1} />
            )
          })}
          <PlannerActivity empty itineraryId={this.props.itineraryId} activity={{date: this.props.date / 1000, location: {name: ''}}} index={this.props.activities.length} highestLoadSequence={
            this.props.activities.length > 0 &&
            (this.props.activities[this.props.activities.length - 1].loadSequence ||
            this.props.activities[this.props.activities.length - 1].startLoadSequence ||
            this.props.activities[this.props.activities.length - 1].endLoadSequence ||
            this.props.activities[this.props.activities.length - 1].departureLoadSequence)
          } />
        </div>)}
      </div>
    )
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isOver === !this.props.isOver) {
      if (!nextProps.isOver) this.props.hoverOutsidePlanner()
    }

    const checkIfNoBlankBoxes = array => {
      let result = true
      array.forEach(activity => {
        if (!activity.id) result = false
      })
      return result
    }

    if (!checkIfNoBlankBoxes(this.props.activities) && checkIfNoBlankBoxes(nextProps.activities) && nextProps.isOver) {
      // console.log(nextProps.activities)
      const loadSequenceArr = nextProps.activities.map((activity, i) => {
        const date = activity.date || activity.startDate || activity.departureDate || activity.endDate
        const types = {
          Activity: 'Activity',
          Flight: 'Flight',
          Food: 'Food',
          Transport: 'Transport',
          Lodging: activity.startDate ? 'LodgingCheckin' : 'LodgingCheckout'
        }
        return {
          id: activity.id,
          type: types[activity.__typename],
          loadSequence: i + 1,
          date: date
        }
      })
      // console.log(loadSequenceArr)
      this.props.mutate({
        variables: {
          input: loadSequenceArr
        }
      })
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dropActivity: (activity) => {
      dispatch(dropActivity(activity))
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

export default connect(null, mapDispatchToProps)(graphql(changingLoadSequence)(DropTarget(['activity', 'plannerActivity'], dateTarget, collect)(DateBox)))
