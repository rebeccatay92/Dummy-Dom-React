// ############ TODO: CHANGE DRAG LAYER TO OPAQUE, NOT DONE YET PLEASE IGNORE #############
import React from 'react'
import { DragLayer } from 'react-dnd'
import PlannerActivity from './PlannerActivity'

function collect (monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging()
  }
}

class CustomDragLayer {
  renderItem (type, item) {
    switch (type) {
      case 'plannerActivity':
        return (
          <PlannerActivity activity={this.props.item} />
        )
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
