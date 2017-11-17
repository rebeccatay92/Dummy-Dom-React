import React, { Component } from 'react'
import PlannerActivity from './PlannerActivity'
import { graphql, compose } from 'react-apollo'
import { changingLoadSequence } from '../apollo/activity'
import { updateItineraryDetails, queryItinerary } from '../apollo/itinerary'
// import { queryItinerary } from '../apollo/itinerary'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { dropActivity, deleteActivity, plannerActivityHoverOverActivity, hoverOutsidePlanner } from '../actions/plannerActions'
import { addActivityToBucket, deleteActivityFromBucket } from '../actions/bucketActions'
import { toggleTimeline } from '../actions/plannerTimelineActions'
import PlannerColumnHeader from './PlannerColumnHeader'

import CreateActivityForm from './CreateActivityForm'

const dateTarget = {
  drop (props, monitor) {
  },
  hover (props, monitor) {
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    getItem: monitor.getItem()
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
    const headerSticky = this.props.timelineAtTop
    const sticky = this.props.timelineAtTop && this.props.timeline.days
    return (
      <div>
        <table style={{width: '1052px'}}>
          <thead>
            <tr>
              <th id='timeline-top' style={{width: '89px', position: 'relative'}}>
                {this.props.firstDay && (
                <div style={{position: headerSticky ? 'fixed' : 'absolute', top: headerSticky ? '60px' : '0px', textAlign: 'center', width: 'inherit', zIndex: 10, backgroundColor: '#FAFAFA'}}>
                  <span style={{fontSize: '24px', color: '#EDB5BF', display: 'inline-block'}}>
                    <i onClick={() => this.handleClick()} className='material-icons' style={{marginRight: '-10px', cursor: 'pointer'}}>keyboard_arrow_left</i>
                    <i onClick={() => this.handleClick()} className='material-icons' style={{cursor: 'pointer'}}>keyboard_arrow_right</i>
                  </span>
                  <span style={{fontSize: '16px', display: 'block', color: '#EDB5BF'}}>{this.props.timeline.events ? 'Duration' : 'Days'}</span>
                </div>
                )}
                {this.props.firstDay && this.props.timeline.days && !this.props.getItem && (
                <div style={{position: sticky ? 'fixed' : 'absolute', textAlign: 'center', width: 'inherit', top: sticky ? '120px' : '60px', zIndex: 1, padding: '20px 0'}}>
                  {this.props.dates.map((date, i) => {
                    const isDateOnScreen = this.props.dateOffsets[`day ${i + 1}`]
                    return (
                      <div key={i}>
                        <a href={'#day-' + (i + 1)}>
                          <div style={{padding: '2px', display: 'inline-block', backgroundColor: isDateOnScreen ? '#EDB5BF' : '#FAFAFA', borderRadius: isDateOnScreen ? '5px' : 0}}>
                            <span style={{fontSize: '16px', color: isDateOnScreen ? '#FAFAFA' : '#EDB5BF', display: 'inline-block'}}>Day {i + 1}</span>
                          </div>
                        </a>
                        {i < this.props.dates.length - 1 && <div style={{height: '10px', position: 'relative'}}>
                          {timeline}
                        </div>}
                      </div>
                    )
                  })}
                  <div onClick={() => this.addDay()} style={{padding: '1px 3px', backgroundColor: 'white', border: '1px solid #EDB5BF', display: 'inline-block', marginTop: '20px', cursor: 'pointer'}}>
                    <span style={{fontSize: '16px', color: '#EDB5BF', display: 'inline-block'}}>+ Day</span>
                  </div>
                </div>
                )}
                {!this.props.firstDay && this.props.timeline.events && (
                  timeline
                )}
              </th>
              <th style={{width: `${0.4 * 962}px`}}>
                <div id={'day-' + this.props.day}>
                  <h3 style={{display: 'inline-block', margin: '0 0 0 1vw', fontSize: '24px', fontWeight: '300'}}>Day {this.props.day} </h3>
                  <span style={{fontSize: '16px', display: 'inline-block', position: 'relative', top: '-2px', marginLeft: '0.5vw', fontWeight: '100'}}>{new Date(this.props.date).toDateString().toUpperCase()}</span>
                </div>
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
                {!this.props.firstDay && this.props.timeline.events && timeline}
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
                  <PlannerActivity mouseOverTimeline={this.state.mouseOverTimeline} day={this.props.day} itineraryId={this.props.itineraryId} draggable={this.props.draggable} activity={activity} key={i} index={i} isLast={i === array.length - 1} columns={this.props.columns} firstDay={this.props.firstDay} lastDay={this.props.lastDay} />
                )
              })}
              <PlannerActivity empty itineraryId={this.props.itineraryId} activity={{startDay: this.props.day, location: {name: ''}}} index={this.props.activities.length} lastDay={this.props.lastDay} highestLoadSequence={
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
        {/* <button onClick={() => this.toggleCreateActivityForm()}>Add an activity popup</button> */}
        {this.state.creatingActivity && <CreateActivityForm ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} length={this.props.activities.length} toggleCreateActivityForm={() => this.toggleCreateActivityForm()} />}
      </div>
    )
  }

  toggleCreateActivityForm () {
    this.setState({creatingActivity: !this.state.creatingActivity})
  }

  handleClick () {
    this.props.toggleTimeline({
      events: !this.props.timeline.events,
      days: !this.props.timeline.days
    })
  }

  addDay () {
    this.props.updateItineraryDetails({
      variables: {
        id: this.props.itineraryId,
        days: this.props.days + 1
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })
  }

  // scrollToDate (date) {
  //   const div = document.querySelector(date)
  //   console.log(div)
  // }

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
      const loadSequenceArr = nextProps.activities.map((activity, i) => {
        const day = activity.startDay || activity.departureDay || activity.endDay
        const types = {
          Activity: 'Activity',
          Flight: 'Flight',
          Food: 'Food',
          Transport: 'Transport',
          Lodging: activity.startDay ? 'LodgingCheckin' : 'LodgingCheckout'
        }
        return {
          id: activity.id,
          type: types[activity.__typename],
          loadSequence: i + 1,
          day: day
        }
      })
      // console.log(loadSequenceArr)
      this.props.changingLoadSequence({
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
    plannerActivityHoverOverActivity: (index, activity, day) => {
      dispatch(plannerActivityHoverOverActivity(index, activity, day))
    },
    hoverOutsidePlanner: () => {
      dispatch(hoverOutsidePlanner())
    },
    toggleTimeline: (options) => {
      dispatch(toggleTimeline(options))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.plannerColumns,
    timeline: state.plannerTimeline
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(changingLoadSequence, { name: 'changingLoadSequence' }),
  graphql(updateItineraryDetails, { name: 'updateItineraryDetails' })
)(DropTarget(['activity', 'plannerActivity'], dateTarget, collect)(DateBox)))
