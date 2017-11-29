import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, dropActivity, plannerActivityHoverOverActivity } from '../actions/plannerActions'
import { deleteActivityFromBucket, addActivityToBucket } from '../actions/bucketActions'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { createActivity, deleteActivity } from '../apollo/activity'
import { createFood, deleteFood } from '../apollo/food'
import { createFlight, deleteFlight } from '../apollo/flight'
import { createTransport, deleteTransport } from '../apollo/transport'
import { createLodging, deleteLodging } from '../apollo/lodging'
import { queryItinerary } from '../apollo/itinerary'
import ActivityInfo from './ActivityInfo'
import PlannerColumnValue from './PlannerColumnValue'
import PlannerActivityTimeline from './PlannerActivityTimeline'

import CreateActivityForm from './CreateActivityForm'
import CreateFoodForm from './CreateFoodForm'
import { primaryColor } from '../Styles/styles'

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
    let day = props.activity.startDay || props.activity.departureDay || props.activity.endDay
    if (monitor.getItemType() === 'activity') props.hoverOverActivity(props.index, day)
    else if (monitor.getItemType() === 'plannerActivity') props.plannerActivityHoverOverActivity(props.index, monitor.getItem(), day)
  },
  drop (props, monitor) {
    let day = props.activity.startDay
    const typeOfDays = {
      Activity: 'startDay',
      Food: 'startDay',
      Lodging: monitor.getItem().startDay ? 'startDay' : 'endDay',
      Transport: 'departureDay',
      Flight: 'departureDay'
    }
    // const typeOfTimes = {
    //   Activity: {
    //     start: 'startTime',
    //     end: 'endTime'
    //   },
    //   Food: {
    //     start: 'startTime',
    //     end: 'endTime'
    //   },
    //   Lodging: {
    //     start: monitor.getItem().startTime ? 'startTime' : 'endTime',
    //     end: monitor.getItem().startTime ? 'startTime' : 'endTime'
    //   },
    //   Transport: {
    //     start: 'departureTime',
    //     end: 'arrivalTime'
    //   },
    //   Flight: {
    //     start: 'departureTime',
    //     end: 'arrivalTime'
    //   }
    // }
    // const timeDiff = day - monitor.getItem()[typeOfDays[monitor.getItem().__typename]]
    // console.log(timeDiff)
    let newActivity = {...monitor.getItem(),
      ...{
        [typeOfDays[monitor.getItem().__typename]]: day
        // [typeOfTimes[monitor.getItem().__typename]['start']]: monitor.getItem()[typeOfTimes[monitor.getItem().__typename]['start']] + timeDiff,
        // [typeOfTimes[monitor.getItem().__typename]['end']]: monitor.getItem()[typeOfTimes[monitor.getItem().__typename]['end']] + timeDiff
      }
    }
    props.dropActivity(newActivity, props.index)
    if (monitor.getItemType() === 'activity') {
      props.deleteActivityFromBucket(monitor.getItem())
    }
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
      creatingEvent: false,
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
    if (!this.props.activity.id && !this.props.empty) {
      minHeight = getItem.__typename === 'Flight' || getItem.__typename === 'Transport' ? '24vh' : '12vh'
    }
    const timeline = (
      <div style={{
        width: '1.5px',
        height: this.props.lastDay && this.props.isLast ? '60%' : '100%',
        display: 'inline-block',
        position: 'absolute',
        top: this.props.firstDay && this.props.index === 0 ? '20px' : '0',
        left: '50%',
        bottom: '0',
        margin: '0 auto',
        backgroundColor: primaryColor
      }} />
    )
    let activityBox = (
      <tr style={{
        cursor: this.state.draggable ? 'move' : 'default',
        border: this.props.activity.id ? 'none' : '1px dashed black',
        position: 'relative'
      }} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
        <td style={{width: '89px', position: 'relative'}}>
          {this.props.timeline.events && timeline}
          {this.props.timeline.events && <PlannerActivityTimeline activity={this.props.activity} day={this.props.day} type={this.props.activity.__typename} checkout={this.props.activity.__typename === 'Lodging' && !this.props.activity.startTime} isLast={this.props.isLast} lastDay={this.props.lastDay} startTime={this.props.activity.startTime || this.props.activity.departureTime} endTime={this.props.activity.endTime || this.props.activity.arrivalTime} id={this.props.activity.id} draggingItem={getItem} />}
        </td>
        <td colSpan={this.state.expanded ? '4' : '1'} style={{width: `${0.4 * 962}px`}}>
          <div style={{ lineHeight: '100%', padding: '1vh 0', minHeight: this.props.activity.id ? '12vh' : minHeight }} key={this.props.activity.id}>
            {this.renderInfo(this.props.activity.__typename, this.state.expanded)}
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
    let createEventBox = (
      <div style={{
        cursor: 'pointer'
      }}>
        <p style={{marginTop: 0, fontSize: '16px', color: '#EDB5BF', display: 'inline-block', ':hover': {backgroundColor: this.state.creatingEvent ? '#FAFAFA' : '#f0f0f0'}}}>+ Add Event</p>
      </div>
    )
    if (this.state.creatingEvent) {
      const types = ['directions_run', 'restaurant', 'hotel', 'flight', 'directions_subway', 'local_car_wash', 'directions_boat']
      const eventTypes = ['Activity', 'Food', 'Lodging', 'Flight', 'Train', 'Car', 'Ferry']
      createEventBox = (
        <div style={{position: 'absolute', top: '-1vh'}}>
          <span>
            {types.map((type, i) => {
              return (
                <i key={i} onClick={() => this.handleCreateEventClick(eventTypes[i])} className='material-icons' style={activityIconStyle}>{type}</i>
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
          <td style={{width: '89px', position: 'relative'}}>
            {!this.props.lastDay && this.props.timeline.events && timeline}
          </td>
          <td colSpan='4'>
            <div onClick={() => this.setState({
              creatingEvent: true
            })} style={{
              margin: '1vh 0 3vh 1vw',
              height: '40px',
              position: 'relative'
            }}>
              {createEventBox}
            </div>

            {this.state.createEventForm &&
              <div>
                {this.state.createEventForm === 'Activity' &&
                <CreateActivityForm ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} countries={this.props.countries} highestLoadSequence={this.props.highestLoadSequence} toggleCreateEventForm={() => this.handleCreateEventClick()} />
                }
                {this.state.createEventForm === 'Food' &&
                <CreateFoodForm ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} countries={this.props.countries} highestLoadSequence={this.props.highestLoadSequence} toggleCreateEventForm={() => this.handleCreateEventClick()} />
                }
              </div>
            }
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
      creatingEvent: false,
      _radiumStyleState: {}
    })
  }

  handleCreateEventClick (eventType = null) {
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
          let startTime = new Date(this.props.activity.startTime * 1000).toGMTString().substring(17, 22)
          let endTime = new Date(this.props.activity.endTime * 1000).toGMTString().substring(17, 22)
          return (
            <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} /><span> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.name} />
                {expandButton}
              </p>
              <p style={timeStyle}><ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} />{' - '}<ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='endTime' value={endTime} /></p>
            </div>
          )
        case 'Flight':
          let departureTime = new Date(this.props.activity.departureTime * 1000).toGMTString().substring(17, 22)
          let arrivalTime = new Date(this.props.activity.arrivalTime * 1000).toGMTString().substring(17, 22)
          return (
            <div style={activityBoxStyle}>
              <div style={{height: '10vh', marginBottom: '2vh'}}>
                <p style={nameStyle}><ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity.departureLocation.name} /> - Flight Departure</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureTime' value={departureTime} /></p>
              </div>
              <div style={{height: '10vh'}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity.arrivalLocation.name} /> - Flight Arrival</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={arrivalTime} /></p>
              </div>
            </div>
          )
        case 'Food':
          startTime = new Date(this.props.activity.startTime * 1000).toGMTString().substring(17, 22)
          endTime = new Date(this.props.activity.endTime * 1000).toGMTString().substring(17, 22)
          return (
            <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
              <p style={nameStyle}>
                <ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} /><span> - </span>
                <ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.name} />
                {expandButton}
              </p>
              <p style={timeStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} />{' - '}<ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='endTime' value={endTime} /></p>
            </div>
          )// import CreateActivityForm from './CreateActivityForm'
        case 'Transport':
          departureTime = new Date(this.props.activity.departureTime * 1000).toGMTString().substring(17, 22)
          arrivalTime = new Date(this.props.activity.arrivalTime * 1000).toGMTString().substring(17, 22)
          return (
            <div style={activityBoxStyle}>
              <div style={{height: '10vh', marginBottom: '2vh'}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity.departureLocation.name} /> - Departure</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureTime' value={departureTime} /></p>
              </div>
              <div style={{height: '10vh'}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity.arrivalLocation.name} /> - Arrival</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={arrivalTime} /></p>
              </div>
            </div>
          )
        case 'Lodging':
          let time, name
          if (this.props.activity.startTime) {
            time = new Date(this.props.activity.startTime * 1000).toGMTString().substring(17, 22)
            name = 'startTime'
          } else {
            time = new Date(this.props.activity.endTime * 1000).toGMTString().substring(17, 22)
            name = 'endTime'
          }
          return (
            <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
              <div style={{display: 'inline'}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} /> {this.props.activity.startDay ? ' - Check In' : ' - Check Out'} </p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name={name} value={time} /></p>
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
