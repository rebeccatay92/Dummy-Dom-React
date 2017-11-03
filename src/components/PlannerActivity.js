import React, { Component } from 'react'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, dropActivity, plannerActivityHoverOverActivity } from '../actions/plannerActions'
import { deleteActivityFromBucket, addActivityToBucket } from '../actions/bucketActions'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { createActivity, createFlight, createFood, createLodging, createTransport, deleteActivity, deleteFlight, deleteFood, deleteLodging, deleteTransport } from '../apollo/activity'
import { queryItinerary } from '../apollo/itinerary'
import ActivityInfo from './ActivityInfo'

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
      minHeight = getItem.__typename === 'Flight' || getItem.__typename === 'Transport' ? '22vh' : '12vh'
    }
    let activityBox = (
      <div style={{ cursor: this.state.draggable ? 'move' : 'default', border: this.props.activity.id ? '1px solid white' : '1px dashed black', backgroundColor: this.props.activity.id ? 'white' : 'yellow', lineHeight: '100%', paddingBottom: '2vh', minHeight: this.props.activity.id ? '12vh' : minHeight }} key={this.props.activity.id}>
        {this.renderInfo(this.props.activity.__typename)}
        {/*
          {this.props.activity.id && <button onClick={() => this.handleDelete()}>Delete</button>}
        */}
      </div>
    )
    let dragBox = (
      <div style={{cursor: 'pointer'}}>
        <h5 style={{marginTop: 0}}>+ Add Activity</h5>
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
          {/* <button onClick={(e) => {
            e.preventDefault()
            this.setState({creatingActivity: false})
          }}>cancel</button> */}
        </form>
      )
    }
    if (this.props.empty) {
      return connectDropTarget(
        <div onClick={() => this.setState({creatingActivity: true})} onMouseDown={() => this.setState({onBox: true})} onMouseUp={() => this.setState({onBox: false})} style={{overflow: 'hidden', marginLeft: '1vw'}} >
          {dragBox}
        </div>
      )
    }
    if (this.state.draggable) return connectDragSource(connectDropTarget(activityBox))
    else return activityBox
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
      fontSize: '10pt',
      marginLeft: '1vw'
    }
    switch (type) {
      case 'Activity':
        let startTime = new Date(this.props.activity.startTime).toTimeString().split('').slice(0, 5)
        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <h4 style={{display: 'inline'}}>
              <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.name} />: <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} />
            </h4>
            <p style={{marginTop: 0}}><ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} /></p>
          </div>
        )
      case 'Flight':
        let departureTime = new Date(this.props.activity.departureTime).toTimeString().split('').slice(0, 5)
        let arrivalTime = new Date(this.props.activity.arrivalTime).toTimeString().split('').slice(0, 5)
        return (
          <div style={activityBoxStyle}>
            <div style={{height: '10vh', paddingBottom: '2vh'}}>
              <h4 style={{display: 'inline'}}> Flight Departure: <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity.departureLocation.name} /></h4>
              <p style={{marginTop: 0}}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureTime' value={departureTime} /></p>
            </div>
            <div style={{height: '10vh'}}>
              <h4 style={{display: 'inline'}}> Flight Arrival: <ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity.arrivalLocation.name} /></h4>
              <p style={{marginTop: 0}}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={arrivalTime} /></p>
            </div>
          </div>
        )
      case 'Food':
        startTime = new Date(this.props.activity.startTime).toTimeString().split('').slice(0, 5)
        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <h4 style={{display: 'inline'}}>
              <ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.name} />: <ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} />
            </h4>
            <p style={{marginTop: 0}}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} /></p>
          </div>
        )
      case 'Transport':
        departureTime = new Date(this.props.activity.departureTime).toTimeString().split('').slice(0, 5)
        arrivalTime = new Date(this.props.activity.arrivalTime).toTimeString().split('').slice(0, 5)
        return (
          <div style={activityBoxStyle}>
            <div style={{height: '10vh', paddingBottom: '2vh'}}>
              <h4 style={{display: 'inline'}}> Departure: <ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity.departureLocation.name} /></h4>
              <p style={{marginTop: 0}}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureTime' value={departureTime} /></p>
            </div>
            <div style={{height: '10vh'}}>
              <h4 style={{display: 'inline'}}> Arrival: <ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity.arrivalLocation.name} /></h4>
              <p style={{marginTop: 0}}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={arrivalTime} /></p>
            </div>
          </div>
        )
      case 'Lodging':
        let time, name
        if (this.props.activity.startTime) {
          time = new Date(this.props.activity.startTime).toTimeString().split('').slice(0, 5)
          name = 'startTime'
        } else {
          time = new Date(this.props.activity.endTime).toTimeString().split('').slice(0, 5)
          name = 'endTime'
        }

        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <div style={{display: 'inline'}}>
              <h4 style={{display: 'inline'}}> {this.props.activity.startDate ? 'Check In:' : 'Check Out:'} <ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} /></h4>
              <p style={{marginTop: 0}}><ActivityInfo activityId={this.props.activity.id} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name={name} value={time} /></p>
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
)(DragSource('plannerActivity', plannerActivitySource, collectSource)(DropTarget(['activity', 'plannerActivity'], plannerActivityTarget, collectTarget)(PlannerActivity))))
