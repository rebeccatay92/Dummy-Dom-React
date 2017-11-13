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
    const timeline = (
      <div style={{
        width: '1.5px',
        height: '100%',
        display: 'inline-block',
        position: 'absolute',
        top: '0',
        left: '50%',
        bottom: '0',
        margin: '0 auto',
        backgroundColor: '#EDB5BF'
      }} />
    )
    // if (this.props.activities.length > 0) console.log(this.props.activities)
    return (
      <table style={{width: '1052px'}}>
        <thead>
          <tr>
            <th style={{width: '89px', position: 'relative'}}>
              {this.props.firstDay && (
                <div style={{position: 'absolute', display: 'inline-block', top: '8px', textAlign: 'center', lineHeight: 'initial'}}>
                  <span style={{fontSize: '24px', color: '#EDB5BF', display: 'inline-block'}}>
                    <i className='material-icons' style={{marginRight: '-10px'}}>keyboard_arrow_left</i>
                    <i className='material-icons'>keyboard_arrow_right</i>
                  </span>
                  <span style={{fontSize: '16px', display: 'inline-block', color: '#EDB5BF'}}>Duration</span>
                </div>
              )}
              {!this.props.firstDay && (
                timeline
              )}
            </th>
            <th style={{width: `${0.4 * 962}px`}}>
              <h3 style={{display: 'inline-block', margin: '0 0 0 1vw', fontSize: '24px', fontWeight: '300'}}>Day {this.props.day} </h3>
              <span style={{fontSize: '16px', display: 'inline-block', position: 'relative', top: '-2px', marginLeft: '0.5vw', fontWeight: '100'}}>{new Date(this.props.date).toDateString().toUpperCase()}</span>
            </th>
            {[1, 2, 3].map(i => {
              return !this.props.firstDay && (
                <th style={{width: `${0.2 * 962}px`}} key={i} />
              )
            })}
            {this.props.firstDay && (
              this.props.columns.map((column, i) => {
                return (
                  <PlannerColumnHeader key={i} column={column} index={i} />
                )
              })
            )}
          </tr>
          <tr>
            <td style={{width: '89px', position: 'relative'}}>
              {!this.props.firstDay && timeline}
            </td>
            <td colSpan='4'>
              <hr style={{marginBottom: '2vh', marginTop: this.props.firstDay ? '0' : '1vh', width: '100%', height: '8px', boxShadow: '0 8px 10px -10px #86919f inset'}} />
            </td>
          </tr>
        </thead>
        {connectDropTarget(
          <tbody>
            {this.props.activities.map((activity, i, array) => {
              return (
                <PlannerActivity itineraryId={this.props.itineraryId} draggable={this.props.draggable} activity={activity} key={i} index={i} isLast={i === array.length - 1} columns={this.props.columns} firstDay={this.props.firstDay} lastDay={this.props.lastDay} />
              )
            })}
            <PlannerActivity empty itineraryId={this.props.itineraryId} activity={{date: this.props.date / 1000, location: {name: ''}}} index={this.props.activities.length} lastDay={this.props.lastDay} highestLoadSequence={
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
