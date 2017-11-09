import React, { Component } from 'react'
import PlannerActivity from './PlannerActivity'
import { graphql } from 'react-apollo'
import { changingLoadSequence } from '../apollo/activity'
// import { queryItinerary } from '../apollo/itinerary'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { dropActivity, deleteActivity, plannerActivityHoverOverActivity, hoverOutsidePlanner } from '../actions/plannerActions'
import { addActivityToBucket, deleteActivityFromBucket } from '../actions/bucketActions'
import PlannerColumnHeader from './PlannerColumnHeader'

import CreateActivityForm from './CreateActivityForm'

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
  constructor (props) {
    super(props)
    this.state = {
      creatingActivity: false
    }
  }

  render () {
    const { connectDropTarget } = this.props
    // if (this.props.activities.length > 0) console.log(this.props.activities)
    var startDate = (this.props.startDate).toISOString().substring(0, 10)
    var endDate = (this.props.endDate).toISOString().substring(0, 10)
    console.log(startDate, endDate)

    return (
      <div>
        <table style={{width: '100%'}}>
          <thead>
            <tr>
              <th style={{width: '40%'}}>
                <h3 style={{display: 'inline-block', margin: '0 0 0 1vw', fontSize: '24px'}}>Day {this.props.day} </h3>
                <span style={{fontSize: '16px', display: 'inline-block', position: 'relative', top: '-2px', marginLeft: '0.5vw', fontWeight: '100'}}>{new Date(this.props.date).toDateString().toUpperCase()}</span>
              </th>
              {/* {
                this.props.firstDay && this.props.columns.includes('Notes') &&
                <PlannerColumnHeader column='Notes' index={0} />
              } */}
              {this.props.firstDay && (
                this.props.columns.map((column, i) => {
                  return (
                    <PlannerColumnHeader key={i} column={column} index={i} />
                  )
                })
              )}
            </tr>
            <tr>
              <td colSpan='4' >
                <hr style={{margin: '1vh 0 2vh 0', width: '100%', height: '8px', boxShadow: '0 8px 10px -10px #86919f inset'}} />
              </td>
            </tr>
          </thead>
          {connectDropTarget(
            <tbody>
              {this.props.activities.map((activity, i, array) => {
                return (
                  <PlannerActivity itineraryId={this.props.itineraryId} draggable={this.props.draggable} activity={activity} key={i} index={i} isLast={i === array.length - 1} columns={this.props.columns} />
                )
              })}
              <PlannerActivity empty itineraryId={this.props.itineraryId} activity={{date: this.props.date / 1000, location: {name: ''}}} index={this.props.activities.length} highestLoadSequence={
                this.props.activities.length > 0 &&
                (this.props.activities[this.props.activities.length - 1].loadSequence ||
                  this.props.activities[this.props.activities.length - 1].startLoadSequence ||
                  this.props.activities[this.props.activities.length - 1].endLoadSequence ||
                  this.props.activities[this.props.activities.length - 1].departureLoadSequence)
                }
              />
            </tbody>
          )}
        </table>
        <button onClick={() => this.toggleCreateActivityForm()}>Add an activity popup</button>
        <div hidden={!this.state.creatingActivity}>
          <CreateActivityForm ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} startDate={startDate} endDate={endDate} length={this.props.activities.length} toggleCreateActivityForm={() => this.toggleCreateActivityForm()} />
        </div>
      </div>
    )
  }
  toggleCreateActivityForm () {
    this.setState({creatingActivity: !this.state.creatingActivity})
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
      console.log('called')
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
    plannerActivityHoverOverActivity: (index, activity, date) => {
      dispatch(plannerActivityHoverOverActivity(index, activity, date))
    },
    hoverOutsidePlanner: () => {
      dispatch(hoverOutsidePlanner())
    }
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.plannerColumns
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(changingLoadSequence)(DropTarget(['activity', 'plannerActivity'], dateTarget, collect)(DateBox)))
