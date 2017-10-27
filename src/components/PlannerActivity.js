import React, { Component } from 'react'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, addActivity, plannerActivityHoverOverActivity } from '../actions/plannerActions'
import { deleteActivityFromBucket, addActivityToBucket } from '../actions/bucketActions'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { createActivity, updateActivity, deleteActivity } from '../apollo/activity'
import { queryItinerary } from '../apollo/itinerary'

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
      onBox: false,
      name: '',
      LocationId: '',
      activityName: this.props.activity.name,
      locationName: this.props.activity.location.name,
      editing: {
        activityName: false,
        locationName: false
      }
    }
  }

  render () {
    const { connectDropTarget, connectDragSource } = this.props
    let activityBox = (
      <div style={{ cursor: this.props.draggable ? 'move' : 'default', minHeight: '10vh', border: this.props.activity.id ? '1px solid white' : '1px dashed black', backgroundColor: this.props.activity.id ? 'white' : 'yellow', lineHeight: '0.5em' }} key={this.props.activity.id}>
        {this.renderProps('activityName')}
        {this.renderProps('locationName')}
        {this.props.activity.id && <button onClick={() => this.handleDelete()}>Delete</button>}
        {/* {
          !this.props.activity.id ||
          <button style={{marginBottom: '1vh'}} onClick={() => this.props.handleClick(this.props.activity)}>Remove</button>
        } */}
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
          <input required style={{width: '39%'}} value={this.state.activityName} onChange={(e) => this.handleChange(e)} name='name' />
          <label style={{display: 'inline-block', width: '10%', textAlign: 'center'}}>Location: </label>
          <input required style={{width: '40%'}} value={this.state.activityLocation} onChange={(e) => this.handleChange(e)} name='LocationId' />
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
    if (this.allFalse(this.state.editing)) return connectDragSource(connectDropTarget(activityBox))
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
    this.setState({
      activityName: nextProps.activity.name,
      locationName: nextProps.activity.location.name
    })
  }

  renderProps (element) {
    if (this.state.editing[element]) {
      return (
        <form onSubmit={(e) => this.handleEdit(e, element)} style={{display: 'block'}}>
          <input name={element} onChange={(e) => this.setState({ [element]: e.target.value })} value={this.state[element]} />
          <button type='submit'>ok</button>
        </form>
      )
    } else {
      // const properties = {
      //   activityName: 'name',
      //   locationName: 'location'
      // }
      return (
        <p onClick={() => this.setState({editing: Object.assign(this.state.editing, { [element]: true })})}>{this.state[element]}</p>
      )
    }
  }

  allFalse (obj) {
    for (var o in obj) {
      if (obj[o]) return false
    }
    return true
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({
      creatingActivity: false
    })
    this.props.createActivity({
      variables: {
        name: this.state.name,
        date: this.props.activity.date,
        LocationId: this.state.LocationId,
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

  handleEdit (e, element) {
    e.preventDefault()
    const properties = {
      activityName: 'name',
      locationName: 'LocationId'
    }

    this.setState({
      editing: Object.assign(this.state.editing, {[element]: false})
    })

    this.props.updateActivity({
      variables: {
        id: this.props.activity.id,
        [properties[element]]: this.state[element]
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
  graphql(updateActivity, { name: 'updateActivity' }),
  graphql(deleteActivity, { name: 'deleteActivity' })
)(DragSource('plannerActivity', plannerActivitySource, collectSource)(DropTarget(['activity', 'plannerActivity'], plannerActivityTarget, collectTarget)(PlannerActivity))))
