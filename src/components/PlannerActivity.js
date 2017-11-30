import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, dropActivity, plannerActivityHoverOverActivity } from '../actions/plannerActions'
import { deleteActivityFromBucket, addActivityToBucket } from '../actions/bucketActions'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { createActivity, createFlight, createFood, createLodging, createTransport, deleteActivity, deleteFlight, deleteFood, deleteLodging, deleteTransport } from '../apollo/activity'
import { queryItinerary } from '../apollo/itinerary'
import ActivityInfo from './ActivityInfo'
import PlannerColumnValue from './PlannerColumnValue'
import PlannerActivityTimeline from './PlannerActivityTimeline'
import CreateActivityForm from './CreateActivityForm'
import { primaryColor, timelineStyle, eventBoxStyle, timelineColumnStyle, dateTableFirstHeaderStyle, eventBoxFirstColumnStyle } from '../Styles/styles'

const activityIconStyle = {
  fontSize: '24px',
  marginRight: '1vw',
  WebkitTextStroke: '1px ' + primaryColor,
  WebkitTextFillColor: '#FAFAFA',
  cursor: 'pointer',
  ':hover': {
    WebkitTextStroke: '2px ' + primaryColor
  }
}

const plannerActivitySource = {
  beginDrag (props) {
    return props.activity
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
    let day = props.activity.day
    if (monitor.getItemType() === 'activity') props.hoverOverActivity(props.index, day)
    else if (monitor.getItemType() === 'plannerActivity') props.plannerActivityHoverOverActivity(props.index, monitor.getItem(), day)
  },
  drop (props, monitor) {
    let day = props.activity.day
    // const typeOfDays = {
    //   Activity: 'startDay',
    //   Food: 'startDay',
    //   Lodging: monitor.getItem().start ? 'startDay' : 'endDay',
    //   Transport: monitor.getItem().start ? 'startDay' : 'endDay',
    //   Flight: monitor.getItem().start ? 'startDay' : 'endDay'
    // }
    let newActivity = {...monitor.getItem(),
      ...{
        day: day
      }
    }
    props.dropActivity(newActivity, props.index)
    // if (monitor.getItemType() === 'activity') {
    //   props.deleteActivityFromBucket(monitor.getItem())
    // }
  }
}

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

function collectSource (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    getItem: monitor.getItem()
  }
}

class PlannerActivity extends Component {
  constructor (props) {
    super(props)

    this.state = {
      creatingActivity: false,
      onBox: false,
      draggable: true,
      expanded: false,
      hover: false
      // activityName: this.props.activity.name,
      // locationName: this.props.activity.location.name,
      // Activity: this.props.activity.__typename === 'Activity' && this.props.activity,
      // Flight: this.props.activity.__typename === 'Flight' && this.props.activity,
      // Lodging: this.props.activity.__typename === 'Lodging' && this.props.activity,
      // Transport: this.props.activity.__typename === 'Transport' && this.props.activity,
      // Food: this.props.activity.__typename === 'Food' && this.props.activity
    }
  }

  render () {
    const { connectDropTarget, connectDragSource, getItem } = this.props
    let minHeight
    if (!this.props.activity.modelId && !this.props.empty) {
      minHeight = '12vh'
    }
    let type
    if (this.props.activity.type) type = this.props.activity.type
    const timeline = (
      <div style={{...timelineStyle,
        ...{
          height: this.props.lastDay && this.props.isLast ? '60%' : '100%',
          top: this.props.firstDay && this.props.index === 0 ? '20px' : '0'
        }
      }} />
    )
    let activityBox = (
      <tr style={eventBoxStyle(this.state.draggable, this.props.activity.modelId)} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
        <td style={timelineColumnStyle}>
          {this.props.timeline.events && timeline}
          {this.props.timeline.events && <PlannerActivityTimeline activity={this.props.activity} day={this.props.day} start={this.props.activity.start} type={this.props.activity.type} checkout={this.props.activity.type === 'Lodging' && !this.props.activity.start} isLast={this.props.isLast} lastDay={this.props.lastDay} startTime={this.props.activity[type].startTime} endTime={this.props.activity[type].endTime} id={this.props.activity.modelId} draggingItem={getItem} />}
        </td>
        <td colSpan={this.state.expanded ? '4' : '1'} style={dateTableFirstHeaderStyle}>
          <div style={eventBoxFirstColumnStyle(this.props.activity.modelId, minHeight)} key={this.props.activity.modelId}>
            {this.renderInfo(this.props.activity.type, this.state.expanded)}
          </div>
        </td>
        {
          !this.state.expanded && this.props.columns && this.props.columns.includes('Notes') &&
          <PlannerColumnValue column='Notes' activity={this.props.activity} isLast hover={this.state.hover} />
        }
        {!this.state.expanded && this.props.columns && !this.props.columns.includes('Notes') && this.props.columns.map((column, i) => {
          return <PlannerColumnValue key={i} column={column} activity={this.props.activity} isLast={i === 2} hover={this.state.hover} />
        })}
      </tr>
    )
    let createActivityBox = (
      <div style={{
        cursor: 'pointer'
      }}>
        <p style={{marginTop: 0, fontSize: '16px', color: primaryColor, display: 'inline-block', ':hover': {backgroundColor: this.state.creatingActivity ? '#FAFAFA' : '#f0f0f0'}}}>+ Add Activity</p>
      </div>
    )
    if (this.state.creatingActivity) {
      const types = ['directions_run', 'hotel', 'flight', 'directions_subway', 'local_car_wash', 'restaurant', 'directions_boat']
      const eventTypes = ['activity', 'lodging', 'flight', 'train', 'car', 'food', 'ferry']
      createActivityBox = (
        <div style={{position: 'absolute', top: '-1vh'}}>
          <span>
            {types.map((type, i) => {
              return (
                <i key={i} onClick={() => this.handleCreateActivityClick(eventTypes[i])} className='material-icons' style={activityIconStyle}>{type}</i>
              )
            })}
            <span style={{fontSize: '16px', color: primaryColor, position: 'relative', top: '-6px'}}>Pick One</span>
          </span>
        </div>
      )
    }
    if (this.props.empty) {
      return connectDropTarget(
        <tr>
          <td style={timelineColumnStyle}>
            {!this.props.lastDay && this.props.timeline.events && timeline}
          </td>
          <td colSpan='4'>
            <div onClick={() => this.setState({
              creatingActivity: true
            })} style={{
              margin: '1vh 0 3vh 1vw',
              height: '40px',
              position: 'relative'
            }}>
              {createActivityBox}
            </div>
            {this.state.createEventForm && <CreateActivityForm ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} countries={this.props.countries} highestLoadSequence={this.props.highestLoadSequence} toggleCreateActivityForm={() => this.handleCreateActivityClick()} />}
          </td>
          {this.state.createEventForm && <td style={{position: 'fixed', bottom: 0, right: 0, top: 0, left: 0, backgroundColor: 'rgba(250, 250, 250, 0.7)', zIndex: 555}} />}
        </tr>
      )
    }
    if (this.state.draggable) {
      return connectDragSource(connectDropTarget(activityBox))
    } else {
      return activityBox
    }
  }

  handleClickOutside (event) {
    if (!this.props.empty) return
    this.setState({
      creatingActivity: false,
      _radiumStyleState: {}
    })
  }

  handleCreateActivityClick (eventType = null) {
    this.setState({
      createEventForm: eventType
    })
  }

  renderInfo (type, expanded) {
    const activityBoxStyle = {
      fontSize: '16px',
      marginLeft: '1vw',
      fontWeight: '300'
    }
    const nameStyle = {
      display: 'inline-block',
      margin: '10px 0',
      position: 'relative'
    }
    const timeStyle = {
      marginTop: 0,
      color: '#9FACBC'
    }
    const expandButton = this.state.hover && (
      <i key='expandButton' className='material-icons' style={{fontSize: '30px', position: 'absolute', top: '-8px', opacity: '0.6', ':hover': {opacity: '1.0'}}}>expand_more</i>
    )
    if (!expanded) {
      switch (type) {
        case 'Activity':
          let startTime = new Date(this.props.activity[type].startTime * 1000).toGMTString().substring(17, 22)
          let endTime = new Date(this.props.activity[type].endTime * 1000).toGMTString().substring(17, 22)
          return (
            <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location.name} /><span> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity[type].name} />
                {expandButton}
              </p>
              <p style={timeStyle}><ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} />{' - '}<ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='endTime' value={endTime} /></p>
            </div>
          )
        case 'Flight':
          let departureTime = new Date(this.props.activity[type].startTime * 1000).toGMTString().substring(17, 22)
          let arrivalTime = new Date(this.props.activity[type].endTime * 1000).toGMTString().substring(17, 22)
          if (this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity[type].departureLocation.name} /> - Flight Departure</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureTime' value={departureTime} /></p>
              </div>
            )
          } else if (!this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity[type].arrivalLocation.name} /> - Flight Arrival</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={arrivalTime} /></p>
              </div>
            )
          }
          break
        case 'Food':
          startTime = new Date(this.props.activity[type].startTime * 1000).toGMTString().substring(17, 22)
          endTime = new Date(this.props.activity[type].endTime * 1000).toGMTString().substring(17, 22)
          return (
            <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
              <p style={nameStyle}>
                <ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location.name} /><span> - </span>
                <ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity[type].name} />
                {expandButton}
              </p>
              <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} />{' - '}<ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='endTime' value={endTime} /></p>
            </div>
          )// import CreateActivityForm from './CreateActivityForm'
        case 'Transport':
          departureTime = new Date(this.props.activity[type].startTime * 1000).toGMTString().substring(17, 22)
          arrivalTime = new Date(this.props.activity[type].endTime * 1000).toGMTString().substring(17, 22)
          if (this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity[type].departureLocation.name} /> - Departure</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureTime' value={departureTime} /></p>
              </div>
            )
          } else if (!this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity[type].arrivalLocation.name} /> - Arrival</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={arrivalTime} /></p>
              </div>
            )
          }
          break
        case 'Lodging':
          let time, name
          if (this.props.activity.start) {
            time = new Date(this.props.activity[type].startTime * 1000).toGMTString().substring(17, 22)
            name = 'startTime'
          } else {
            time = new Date(this.props.activity[type].endTime * 1000).toGMTString().substring(17, 22)
            name = 'endTime'
          }
          return (
            <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
              <div style={{display: 'inline'}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location.name} /> {this.props.activity.start ? ' - Check In' : ' - Check Out'} </p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name={name} value={time} /></p>
              </div>
            </div>
          )
        default:
          return null
      }
    }
  }

  toggleDraggable () {
    this.setState({
      draggable: !this.state.draggable
    })
  }

  // handleSubmit (e) {
  //   e.preventDefault()
  //   this.setState({
  //     creatingActivity: false
  //   })
  //   this.props.createActivity({
  //     variables: {
  //       name: this.state.activityName,
  //       date: this.props.activity.date,
  //       LocationId: this.state.locationName,
  //       ItineraryId: this.props.itineraryId,
  //       loadSequence: this.props.highestLoadSequence + 1
  //     },
  //     refetchQueries: [{
  //       query: queryItinerary,
  //       variables: { id: this.props.itineraryId }
  //     }]
  //   })
  // }

  // handleChange (e) {
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   })
  // }

  handleDelete () {
    this.props.deleteActivity({
      variables: {
        id: this.props.activity.id
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hoverOverActivity: (index, date) => {
      dispatch(hoverOverActivity(index, date))
    },
    dropActivity: (activity, index) => {
      dispatch(dropActivity(activity, index))
    },
    deleteActivityFromBucket: (activity) => {
      dispatch(deleteActivityFromBucket(activity))
    },
    plannerActivityHoverOverActivity: (index, activity, date) => {
      dispatch(plannerActivityHoverOverActivity(index, activity, date))
    },
    addActivityToBucket: (activity) => {
      dispatch(addActivityToBucket(activity))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    timeline: state.plannerTimeline
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(createActivity, { name: 'createActivity' }),
  graphql(deleteActivity, { name: 'deleteActivity' })
)(DragSource('plannerActivity', plannerActivitySource, collectSource)(DropTarget(['activity', 'plannerActivity'], plannerActivityTarget, collectTarget)(onClickOutside(Radium(PlannerActivity))))))
