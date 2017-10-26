import React, { Component } from 'react'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, addActivity, plannerActivityHoverOverActivity } from '../actions/plannerActions'
import { deleteActivityFromBucket, addActivityToBucket } from '../actions/bucketActions'
import { connect } from 'react-redux'
import { gql, graphql } from 'react-apollo'

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
      LocationId: ''
    }
  }
  render () {
    const { connectDropTarget, connectDragSource } = this.props
    let dragBox = (
      <h4>+ Add Activity</h4>
    )
    if (this.state.creatingActivity) {
      dragBox = (
        <form onSubmit={(e) => this.handleSubmit(e)} style={{margin: '2vh 0 -2vh 0'}}>
          <label style={{display: 'inline-block', width: '10%', textAlign: 'center'}}>Activity Name: </label>
          <input style={{width: '39%'}} value={this.state.activityName} onChange={(e) => this.handleChange(e)} name='name' />
          <label style={{display: 'inline-block', width: '10%', textAlign: 'center'}}>Location: </label>
          <input style={{width: '39%'}} value={this.state.activityLocation} onChange={(e) => this.handleChange(e)} name='LocationId' />
          <input type='submit' value='submit' />
          {/* <button onClick={(e) => {
            e.preventDefault()
            this.setState({creatingActivity: false})
          }}>cancel</button> */}
        </form>
      )
    }
    if (this.props.empty) {
      return connectDropTarget(
        <div onClick={() => this.setState({creatingActivity: true})} onMouseDown={() => this.setState({onBox: true})} onMouseUp={() => this.setState({onBox: false})} >
          {dragBox}
        </div>
      )
    }
    return connectDragSource(connectDropTarget(<div style={{ cursor: this.props.draggable ? 'move' : 'default', height: '10vh', border: this.props.activity.id ? '1px solid white' : '1px dashed black', backgroundColor: this.props.activity.id ? 'white' : 'yellow', lineHeight: '0.5em' }} key={this.props.activity.id}>
      <h4>{this.props.activity.name}</h4>
      <p>{this.props.activity.location.name}</p>
      {/* {
        !this.props.activity.id ||
        <button style={{marginBottom: '1vh'}} onClick={() => this.props.handleClick(this.props.activity)}>Remove</button>
      } */}
    </div>))
  }

  componentDidMount () {
    window.addEventListener('mousedown', () => {
      if (this.state.onBox) {
        return
      }
      this.setState({
        creatingActivity: false
      })
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({
      creatingActivity: false
    })
    this.props.mutate({
      variables: {
        name: this.state.name,
        date: this.props.activity.date,
        LocationId: this.state.LocationId,
        ItineraryId: this.props.itineraryId,
        loadSequence: 1
      },
      refetchQueries: [{
        query: gql`
          query queryItinerary($id: ID!) {
            findItinerary(id: $id){
              activities {
                id
                name
                location {
                  name
                }
                date
              }
            }
          }`,
        variables: { id: this.props.itineraryId }
      }]
    })
  }

  handleChange (e) {
    this.setState({
      [e.target.name]: e.target.value
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

const createActivity = gql`
  mutation createActivity($name: String!, $date: Int!, $LocationId: ID!, $ItineraryId: ID!, $loadSequence: Int!) {
    createActivity(name: $name, date: $date, LocationId: $LocationId, ItineraryId: $ItineraryId, loadSequence: $loadSequence) {
      id
    }
  }
`

export default connect(null, mapDispatchToProps)(graphql(createActivity)(DragSource('plannerActivity', plannerActivitySource, collectSource)(DropTarget(['activity', 'plannerActivity'], plannerActivityTarget, collectTarget)(PlannerActivity))))
