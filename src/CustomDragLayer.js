// ############ TODO: CHANGE DRAG LAYER TO OPAQUE, NOT DONE YET PLEASE IGNORE #############
import React from 'react'
import { DragLayer } from 'react-dnd'

function collect (monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging()
  }
}

class CustomDragLayer {
  renderItem(type, item) {
    switch (type) {
    case 'plannerActivity':
      return (
        <div style={{opacity: '1', marginBottom: '1vh', cursor: item.draggable ? 'move' : 'default', minHeight: '12vh', border: item.id ? '1px solid black' : '10px solid green'}}>
          <h3>{item.name}</h3>
          <p>{item.city}</p>
          {/* {
            !this.props.activity.id ||
            <button style={{marginBottom: '1vh'}} onClick={() => this.props.handleClick(this.props.activity)}>Remove</button>
          } */}
        </div>)
    }
  }

  render () {
    const { item, itemType, isDragging } = this.props
    if (!isDragging) {
      return null
    }

    return (
      <div>
        {this.renderItem(itemType, item)}
      </div>
    )
  }
}

export default DragLayer(collect)(CustomDragLayer)
