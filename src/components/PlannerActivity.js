import React, { Component } from 'react'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, addActivity, plannerActivityHoverOverActivity } from '../actions/plannerActions'
import { deleteActivityFromBucket, addActivityToBucket } from '../actions/bucketActions'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { createActivity, createFlight, createFood, createLodging, createTransport, deleteActivity, deleteFlight, deleteFood, deleteLodging, deleteTransport } from '../apollo/activity'
import { queryItinerary } from '../apollo/itinerary'
import ActivityInfo from './ActivityInfo'

const plannerActivitySource = {
  beginDrag (props) {
    return {
      id: props.activity.id,
      name: props.activity.name,
      location: props.activity.location,
      draggable: props.draggable
    }
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
    if (monitor.getItemType() === 'activity') props.hoverOverActivity(props.index, props.activity.date)
    else if (monitor.getItemType() === 'plannerActivity') props.plannerActivityHoverOverActivity(props.index, monitor.getItem(), props.activity.date)
  },
  drop (props, monitor) {
    let newActivity = Object.assign(monitor.getItem(), {date: props.activity.date})
    props.addActivity(newActivity, props.index)
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
    connectDragPreview: connect.dragPreview()
  }
}

class PlannerActivity extends Component {
  constructor (props) {
    super(props)

    this.state = {
      creatingActivity: false,
      onBox: false
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
    const { connectDropTarget, connectDragSource } = this.props
    let activityBox = (
      <div style={{ cursor: this.props.draggable ? 'move' : 'default', border: this.props.activity.id ? '1px solid white' : '1px dashed black', backgroundColor: this.props.activity.id ? 'white' : 'yellow', lineHeight: '100%', marginBottom: '2vh', minHeight: '10vh' }} key={this.props.activity.id}>
        {this.renderInfo(this.props.activity.__typename)}
        {/*
          {this.props.activity.id && <button onClick={() => this.handleDelete()}>Delete</button>}
        */}
      </div>
    )
    let dragBox = (
      <div style={{cursor: 'pointer'}}>
        <h4>+ Add Activity</h4>
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
        <div onClick={() => this.setState({creatingActivity: true})} onMouseDown={() => this.setState({onBox: true})} onMouseUp={() => this.setState({onBox: false})} style={{overflow: 'hidden'}} >
          {dragBox}
        </div>
      )
    }
    // <h4>{this.props.activity.name}</h4>
    // <p>{this.props.activity.location.name}</p>
    if (!this.state.editing) return connectDragSource(connectDropTarget(activityBox))
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

  componentWillReceiveProps (nextProps) {
    // this.setState({
    //   activityName: nextProps.activity.name,
    //   locationName: nextProps.activity.location.name
    // })
  }

  renderInfo (type) {
    const activityBoxStyle = {
      fontSize: '10pt'
    }
    switch (type) {
      case 'Activity':
        let startTime = new Date(this.props.activity.startTime).toTimeString().split('').slice(0, 5)
        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <h4 style={{display: 'inline'}}>
              <ActivityInfo itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.name} />: <ActivityInfo itineraryId={this.props.itineraryId} type={type} name='location' value={this.props.activity.location.name} />
            </h4>
            <p style={{marginTop: 0}}><ActivityInfo itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} /></p>
          </div>
        )
      case 'Flight':
        let departureTime = new Date(this.props.activity.departureTime).toTimeString().split('').slice(0, 5)
        let arrivalTime = new Date(this.props.activity.arrivalTime).toTimeString().split('').slice(0, 5)
        return (
          <div style={activityBoxStyle}>
            <div style={{height: '10vh', marginBottom: '2vh'}}>
              <h4 style={{display: 'inline'}}> Departure: <ActivityInfo itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity.departureLocation.name} /></h4>
              <p style={{marginTop: 0}}><ActivityInfo itineraryId={this.props.itineraryId} type={type} name='departureTime' value={departureTime} /></p>
            </div>
            <div style={{height: '10vh'}}>
              <h4 style={{display: 'inline'}}> Arrival: <ActivityInfo itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity.arrivalLocation.name} /></h4>
              <p style={{marginTop: 0}}><ActivityInfo itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={arrivalTime} /></p>
            </div>
          </div>
        )
      case 'Food':
        startTime = new Date(this.props.activity.startTime).toTimeString().split('').slice(0, 5)
        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <h4 style={{display: 'inline'}}>
              <ActivityInfo itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.name} />: <ActivityInfo itineraryId={this.props.itineraryId} type={type} name='location' value={this.props.activity.location.name} />
            </h4>
            <p style={{marginTop: 0}}><ActivityInfo itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} /></p>
          </div>
        )
      case 'Transport':
        departureTime = new Date(this.props.activity.departureTime).toTimeString().split('').slice(0, 5)
        arrivalTime = new Date(this.props.activity.arrivalTime).toTimeString().split('').slice(0, 5)
        return (
          <div style={activityBoxStyle}>
            <div style={{height: '10vh', marginBottom: '2vh'}}>
              <h4 style={{display: 'inline'}}> Departure: <ActivityInfo itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity.departureLocation.name} /></h4>
              <p style={{marginTop: 0}}><ActivityInfo itineraryId={this.props.itineraryId} type={type} name='departureTime' value={departureTime} /></p>
            </div>
            <div style={{height: '10vh'}}>
              <h4 style={{display: 'inline'}}> Arrival: <ActivityInfo itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity.arrivalLocation.name} /></h4>
              <p style={{marginTop: 0}}><ActivityInfo itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={arrivalTime} /></p>
            </div>
          </div>
        )
      case 'Lodging':
        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <div style={{display: 'inline'}}>
              <h4 style={{display: 'inline'}}> {this.props.activity.startDate ? 'Check In:' : 'Check Out:'} <ActivityInfo itineraryId={this.props.itineraryId} type={type} name='location' value={this.props.activity.location.name} /></h4>
            </div>
          </div>
        )
    }
  }

  // allFalse (obj) {
  //   for (var o in obj) {
  //     if (obj[o]) return false
  //   }
  //   return true
  // }

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
        loadSequence: 1
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
    addActivity: (activity, index) => {
      dispatch(addActivity(activity, index))
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
