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
import { createLandTransport, deleteLandTransport } from '../apollo/landtransport'
import { createLodging, deleteLodging } from '../apollo/lodging'
import { queryItinerary } from '../apollo/itinerary'
import ActivityInfo from './ActivityInfo'
import PlannerColumnValue from './PlannerColumnValue'
import PlannerActivityTimeline from './PlannerActivityTimeline'

import CreateActivityForm from './createEvent/CreateActivityForm'
import CreateFoodForm from './createEvent/CreateFoodForm'
import CreateFlightForm from './createEvent/CreateFlightForm'
import CreateLodgingForm from './createEvent/CreateLodgingForm'
import CreateLandTransportForm from './createEvent/CreateLandTransportForm'

import PlannerEventExpandedInfo from './PlannerEventExpandedInfo'
import { timelineStyle, eventBoxStyle, timelineColumnStyle, dateTableFirstHeaderStyle, eventBoxFirstColumnStyle, createEventTextStyle, activityIconStyle, createEventBoxStyle, createEventPickOneStyle, createEventBoxContainerStyle, plannerBlurredBackgroundStyle, expandedEventIconsBoxStyle, expandedEventIconsStyle, expandedEventBoxStyle, expandedEventBoxImageContainerStyle, expandedEventBoxImageStyle, expandedEventBoxTextBoxStyle } from '../Styles/styles'

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
      creatingEvent: false,
      createEventType: null,
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
    const startTime = this.props.activity.type === 'Flight' ? this.props.activity[type].FlightInstance.startTime : this.props.activity[type].startTime
    const endTime = this.props.activity.type === 'Flight' ? this.props.activity[type].FlightInstance.endTime : this.props.activity[type].endTime
    let activityBox = (
      <tr style={eventBoxStyle(this.state.draggable && !this.state.expanded, this.props.activity.modelId)} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
        <td style={timelineColumnStyle}>
          {this.props.timeline.events && timeline}
          {this.props.timeline.events && <PlannerActivityTimeline activity={this.props.activity} day={this.props.day} start={this.props.activity.start} type={this.props.activity.type} checkout={this.props.activity.type === 'Lodging' && !this.props.activity.start} isLast={this.props.isLast} lastDay={this.props.lastDay} startTime={startTime} endTime={endTime} id={this.props.activity.modelId} draggingItem={getItem} expanded={this.state.expanded} />}
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
          return <PlannerColumnValue key={i} column={column} activity={this.props.activity} isLast={i === 2} hover={this.state.hover} firstInFlightBooking={this.props.firstInFlightBooking} />
        })}
      </tr>
    )
    let createEventBox = (
      <div style={{
        cursor: 'pointer'
      }}>
        <p style={createEventTextStyle}>+ Add Event</p>
      </div>
    )
    if (this.state.creatingEvent) {
      const iconTypes = ['directions_run', 'restaurant', 'hotel', 'flight', 'directions_subway', 'local_car_wash', 'directions_boat']
      const eventTypes = ['Activity', 'Food', 'Lodging', 'Flight', 'Train', 'LandTransport', 'SeaTransport']
      createEventBox = (
        <div style={createEventBoxStyle}>
          <span>
            {iconTypes.map((type, i) => {
              return (
                <i key={i} onClick={() => this.handleCreateEventClick(eventTypes[i])} className='material-icons' style={activityIconStyle}>{type}</i>
              )
            })}
            <span style={createEventPickOneStyle}>Pick One</span>
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
              creatingEvent: true
            })} style={createEventBoxContainerStyle}>
              {createEventBox}
            </div>

            {this.state.createEventType &&
              <div>
                {this.state.createEventType === 'Activity' &&
                <CreateActivityForm ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} countries={this.props.countries} toggleCreateEventType={() => this.handleCreateEventClick()} />
                }
                {this.state.createEventType === 'Food' &&
                <CreateFoodForm ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} countries={this.props.countries} toggleCreateEventType={() => this.handleCreateEventClick()} />
                }
                {this.state.createEventType === 'Flight' &&
                <CreateFlightForm ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} countries={this.props.countries} toggleCreateEventType={() => this.handleCreateEventClick()} />
                }
                {this.state.createEventType === 'Lodging' &&
                <CreateLodgingForm ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} countries={this.props.countries} toggleCreateEventType={() => this.handleCreateEventClick()} />
                }
                {this.state.createEventType === 'LandTransport' &&
                <CreateLandTransportForm ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} countries={this.props.countries} toggleCreateEventType={() => this.handleCreateEventClick()} />
                }
              </div>
            }
          </td>
          {this.state.createEventType && <td style={plannerBlurredBackgroundStyle} />}
        </tr>
      )
    }
    if (this.state.draggable && !this.state.expanded) {
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
      createEventType: eventType
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
      <i key='expandButton' className='material-icons' style={{fontSize: '30px', position: 'absolute', top: '-8px', ':hover': {color: '#ed9fad'}}} onClick={() => this.setState({expanded: !this.state.expanded})}>{this.state.expanded ? 'expand_less' : 'expand_more'}</i>
    )
    let startTime = new Date(this.props.activity[type].startTime * 1000).toGMTString().substring(17, 22)
    if (type === 'Flight') startTime = new Date(this.props.activity[type].FlightInstance.startTime * 1000).toGMTString().substring(17, 22)
    let endTime = new Date(this.props.activity[type].endTime * 1000).toGMTString().substring(17, 22)
    if (type === 'Flight') endTime = new Date(this.props.activity[type].FlightInstance.endTime * 1000).toGMTString().substring(17, 22)
    if (!expanded) {
      switch (type) {
        case 'Activity':
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
          if (this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity[type].FlightInstance.departureLocation.name} /> - Flight Departure
              {expandButton}</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureTime' value={startTime} /></p>
              </div>
            )
          } else if (!this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity[type].FlightInstance.arrivalLocation.name} /> - Flight Arrival
              {expandButton}</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={endTime} /></p>
              </div>
            )
          }
          break
        case 'Food':
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
        case 'LandTransport':
          if (this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity[type].departureLocation.name} /> - Departure
              {expandButton}</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureTime' value={startTime} /></p>
              </div>
            )
          } else if (!this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity[type].arrivalLocation.name} /> - Arrival
              {expandButton}</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={endTime} /></p>
              </div>
            )
          }
          break
        case 'Lodging':
          let time, name
          if (this.props.activity.start) {
            time = startTime
            name = 'startTime'
          } else {
            time = endTime
            name = 'endTime'
          }
          return (
            <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
              <div style={{display: 'inline'}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location.name} /> {this.props.activity.start ? ' - Check In' : ' - Check Out'}{expandButton}</p>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name={name} value={time} /></p>
              </div>
            </div>
          )
        default:
          return null
      }
    } else if (expanded) {
      const expandedEventIcons = (
        <div style={expandedEventIconsBoxStyle}>
          <i key='expandedActivityEdit' className='material-icons' style={{...expandedEventIconsStyle, ...{marginRight: '5px'}}}>mode_edit</i>
          <i key='expandedActivityMap' className='material-icons' style={{...expandedEventIconsStyle, ...{marginRight: '5px'}}}>map</i>
          <i key='expandedActivityMore' className='material-icons' style={expandedEventIconsStyle}>more_vert</i>
        </div>
      )
      switch (type) {
        case 'Activity' :
          return (
            <div style={{...activityBoxStyle, ...{height: 'auto', marginBottom: '20px'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location.name} /><span> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity[type].name} />
                {expandButton}
              </p>
              <div style={expandedEventBoxStyle}>
                {expandedEventIcons}
                <div style={expandedEventBoxImageContainerStyle}>
                  <img src={this.props.activity[type].backgroundImage} style={expandedEventBoxImageStyle} />
                </div>
                <div style={expandedEventBoxTextBoxStyle}>
                  <PlannerEventExpandedInfo name='Time:' value={`${startTime} to ${endTime}`} />
                  <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity[type].currency} ${this.props.activity[type].cost}`} />
                  <PlannerEventExpandedInfo name='Booking Platform:' value={this.props.activity[type].bookedThrough} />
                  <PlannerEventExpandedInfo name='Booking Number:' value={this.props.activity[type].bookingConfirmation} />
                  <PlannerEventExpandedInfo name='Notes:' value={this.props.activity[type].notes} />
                </div>
              </div>
            </div>
          )
        case 'Food':
          return (
            <div style={{...activityBoxStyle, ...{height: 'auto', marginBottom: '20px'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location.name} /><span> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity[type].name} />
                {expandButton}
              </p>
              <div style={expandedEventBoxStyle}>
                {expandedEventIcons}
                <div style={expandedEventBoxImageContainerStyle}>
                  <img src={this.props.activity[type].backgroundImage} style={expandedEventBoxImageStyle} />
                </div>
                <div style={expandedEventBoxTextBoxStyle}>
                  <PlannerEventExpandedInfo name='Time:' value={`${startTime} to ${endTime}`} />
                  <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity[type].currency} ${this.props.activity[type].cost}`} />
                  <PlannerEventExpandedInfo name='Type:' value={this.props.activity[type].type} />
                  <PlannerEventExpandedInfo name='Booking Platform:' value={this.props.activity[type].bookedThrough} />
                  <PlannerEventExpandedInfo name='Booking Number:' value={this.props.activity[type].bookingConfirmation} />
                  <PlannerEventExpandedInfo name='Notes:' value={this.props.activity[type].notes} />
                </div>
              </div>
            </div>
          )
        case 'LandTransport':
          return (
            <div style={{...activityBoxStyle, ...{height: 'auto', marginBottom: '20px'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.start ? this.props.activity[type].departureLocation.name : this.props.activity[type].arrivalLocation.name} /><span> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.start ? 'Departure' : 'Arrival'} />
                {expandButton}
              </p>
              <div style={expandedEventBoxStyle}>
                {expandedEventIcons}
                <div style={expandedEventBoxImageContainerStyle}>
                  <img src={this.props.activity[type].backgroundImage} style={expandedEventBoxImageStyle} />
                </div>
                <div style={expandedEventBoxTextBoxStyle}>
                  <PlannerEventExpandedInfo name={this.props.activity.start ? 'Departure Time:' : 'Arrival Time:'} value={this.props.activity.start ? startTime : endTime} />
                  <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity[type].currency} ${this.props.activity[type].cost}`} />
                  <PlannerEventExpandedInfo name='Booking Platform:' value={this.props.activity[type].bookedThrough} />
                  <PlannerEventExpandedInfo name='Booking Number:' value={this.props.activity[type].bookingConfirmation} />
                  <PlannerEventExpandedInfo name='Notes:' value={this.props.activity[type].notes} />
                </div>
              </div>
            </div>
          )
        case 'Lodging':
          return (
            <div style={{...activityBoxStyle, ...{height: 'auto', marginBottom: '20px'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location.name} /><span> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.start ? 'Check In' : 'Check Out'} />
                {expandButton}
              </p>
              <div style={expandedEventBoxStyle}>
                {expandedEventIcons}
                <div style={expandedEventBoxImageContainerStyle}>
                  <img src={this.props.activity[type].backgroundImage} style={expandedEventBoxImageStyle} />
                </div>
                <div style={expandedEventBoxTextBoxStyle}>
                  <PlannerEventExpandedInfo name={this.props.activity.start ? 'Check In Time:' : 'Check Out Time:'} value={this.props.activity.start ? startTime : endTime} />
                  <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity[type].currency} ${this.props.activity[type].cost}`} />
                  <PlannerEventExpandedInfo name='Booking Platform:' value={this.props.activity[type].bookedThrough} />
                  <PlannerEventExpandedInfo name='Booking Number:' value={this.props.activity[type].bookingConfirmation} />
                  <PlannerEventExpandedInfo name='Notes:' value={this.props.activity[type].notes} />
                </div>
              </div>
            </div>
          )
        case 'Flight':
          return (
            <div style={{...activityBoxStyle, ...{height: 'auto', marginBottom: '20px'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.start ? this.props.activity[type].FlightInstance.departureLocation.name : this.props.activity[type].FlightInstance.arrivalLocation.name} /><span> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.start ? 'Flight Departure' : 'Flight Arrival'} />
                {expandButton}
              </p>
              <div style={expandedEventBoxStyle}>
                {expandedEventIcons}
                <div style={expandedEventBoxImageContainerStyle}>
                  <img src={this.props.activity[type].FlightBooking.backgroundImage} style={expandedEventBoxImageStyle} />
                </div>
                <div style={expandedEventBoxTextBoxStyle}>
                  <PlannerEventExpandedInfo name={this.props.activity.start ? 'Departure Time:' : 'Arrival Time:'} value={this.props.activity.start ? startTime : endTime} />
                  <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity[type].FlightBooking.currency} ${this.props.activity[type].FlightBooking.cost}`} />
                  <PlannerEventExpandedInfo name='Booking Platform:' value={this.props.activity[type].FlightBooking.bookedThrough} />
                  <PlannerEventExpandedInfo name='Booking Number:' value={this.props.activity[type].FlightBooking.bookingConfirmation} />
                  <PlannerEventExpandedInfo name='Notes:' value={this.props.activity[type].FlightInstance.notes} />
                </div>
              </div>
            </div>
          )
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
