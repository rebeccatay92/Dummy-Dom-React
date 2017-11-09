import React, { Component } from 'react'
import Radium from 'radium'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, dropActivity, plannerActivityHoverOverActivity } from '../actions/plannerActions'
import { deleteActivityFromBucket, addActivityToBucket } from '../actions/bucketActions'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { createActivity, createFlight, createFood, createLodging, createTransport, deleteActivity, deleteFlight, deleteFood, deleteLodging, deleteTransport } from '../apollo/activity'
import { queryItinerary } from '../apollo/itinerary'
import ActivityInfo from './ActivityInfo'
import PlannerColumnValue from './PlannerColumnValue'

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
    let date = props.activity.date || props.activity.startDate || props.activity.departureDate || props.activity.endDate
    if (monitor.getItemType() === 'activity') props.hoverOverActivity(props.index, date)
    else if (monitor.getItemType() === 'plannerActivity') props.plannerActivityHoverOverActivity(props.index, monitor.getItem(), date)
  },
  drop (props, monitor) {
    let date = props.activity.date || props.activity.startDate || props.activity.departureDate || props.activity.endDate
    const typeOfDates = {
      Activity: 'date',
      Food: 'date',
      Lodging: monitor.getItem().startDate ? 'startDate' : 'endDate',
      Transport: 'date',
      Flight: 'departureDate'
    }
    let newActivity = {...monitor.getItem(), ...{[typeOfDates[monitor.getItem().__typename]]: date}}
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
      creatingActivity: false,
      onBox: false,
      draggable: true
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
    let activityBox = (
      <tr style={{
        cursor: this.state.draggable ? 'move' : 'default',
        ':hover': {
          backgroundColor: getItem ? '#FAFAFA' : '#f0f0f0'
        }
      }}>
        <td style={{width: '40%'}}>
          <div style={{ lineHeight: '100%', padding: '1vh 0', minHeight: this.props.activity.id ? '12vh' : minHeight }} key={this.props.activity.id}>
            {this.renderInfo(this.props.activity.__typename)}
          </div>
        </td>
        {
          this.props.columns && this.props.columns.includes('Notes') &&
          <PlannerColumnValue column='Notes' activity={this.props.activity} />
        }
        {this.props.columns && !this.props.columns.includes('Notes') && this.props.columns.map((column, i) => {
          return <PlannerColumnValue key={i} column={column} activity={this.props.activity} />
        })}
      </tr>
    )
    let dragBox = (
      <div style={{cursor: 'pointer'}}>
        <p style={{marginTop: 0, fontSize: '16px', color: '#EDB5BF'}}>+ Add Activity</p>
      </div>
    )
    if (this.state.creatingActivity) {
      dragBox = (
        <form onSubmit={(e) => this.handleSubmit(e)} style={{margin: '2vh 0 -2vh 0'}}>
          <label style={{display: 'inline-block', width: '10%', textAlign: 'center'}}>Name: </label>
          <input required style={{width: '39%'}} onChange={(e) => this.handleChange(e)} name='activityName' />
          <label style={{display: 'inline-block', width: '10%', textAlign: 'center'}}>Location: </label>
          <input required style={{width: '40%'}} onChange={(e) => this.handleChange(e)} name='locationName' />
          <input style={{float: 'right', marginTop: '10px'}} type='submit' value='submit' />
        </form>
      )
    }
    if (this.props.empty) {
      return connectDropTarget(
        <tr>
          <td colSpan='4'>
            <div onClick={() => this.setState({creatingActivity: true})} onMouseDown={() => this.setState({onBox: true})} onMouseUp={() => this.setState({onBox: false})} style={{overflow: 'hidden', marginLeft: '1vw'}} >
              {dragBox}
            </div>
          </td>
        </tr>
      )
    }
    if (this.state.draggable) {
      return connectDragSource(connectDropTarget(activityBox))
    } else {
      return activityBox
    }
  }

  toggleCreateForm () {
    if (this.state.onBox || !this.state.creatingActivity) {
      return
    }
    this.setState({
      creatingActivity: false
    })
  }

  componentDidMount () {
    window.addEventListener('mousedown', () => this.toggleCreateForm())
  }

  renderInfo (type) {
    const activityBoxStyle = {
      fontSize: '16px',
      marginLeft: '1vw',
      fontWeight: '300'
    }
    const nameStyle = {
      display: 'inline-block',
      marginBottom: '10px'
    }
    const timeStyle = {
      marginTop: 0,
      color: '#9FACBC'
    }
    switch (type) {
      case 'Activity':
        let startTime = new Date(this.props.activity.startTime * 1000).toGMTString().substring(17, 22)
        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <p style={nameStyle}>
              <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} /><span> - </span>
              <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.name} />
            </p>
            <p style={timeStyle}><ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} /></p>
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
        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <p style={nameStyle}>
              <ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} /><span> - </span>
              <ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.name} />
            </p>
            <p style={timeStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} /></p>
          </div>
        )
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
              <p style={nameStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} /> {this.props.activity.startDate ? ' - Check In' : ' - Check Out'} </p>
              <p style={timeStyle}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name={name} value={time} /></p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  toggleDraggable () {
    this.setState({
      draggable: !this.state.draggable
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({
      creatingActivity: false
    })
    this.props.createActivity({
      variables: {
        name: this.state.activityName,
        date: this.props.activity.date,
        LocationId: this.state.locationName,
        ItineraryId: this.props.itineraryId,
        loadSequence: this.props.highestLoadSequence + 1
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })
  }

  handleChange (e) {
    this.setState({
      [e.target.name]: e.target.value
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

export default connect(null, mapDispatchToProps)(compose(
  graphql(createActivity, { name: 'createActivity' }),
  graphql(deleteActivity, { name: 'deleteActivity' })
)(DragSource('plannerActivity', plannerActivitySource, collectSource)(DropTarget(['activity', 'plannerActivity'], plannerActivityTarget, collectTarget)(Radium(PlannerActivity)))))
