import React, { Component } from 'react'
import { DragSource } from 'react-dnd'

const activitySource = {
  beginDrag (props) {
    return {
      id: props.activity.id,
      name: props.activity.name,
      city: props.activity.city
    }
  }
}

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class BucketActivity extends Component {
  render () {
    const { connectDragSource } = this.props
    return connectDragSource(
      <div style={{minHeight: '15vh', border: '1px solid black', paddingLeft: '1vw', cursor: 'move'}}>
        <h3>{this.props.activity.name}</h3>
        <p>{this.props.activity.city}</p>
      </div>
    )
  }
}

export default DragSource('activity', activitySource, collect)(BucketActivity)
