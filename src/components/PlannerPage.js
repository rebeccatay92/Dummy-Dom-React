import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Planner from './Planner'
// import BucketList from './BucketList'

class PlannerPage extends Component {
  render () {
    return (
      <div style={{fontFamily: 'Helvetica'}}>
        <div style={{display: 'inline-block', width: '80vw', verticalAlign: 'top', marginRight: '1vw'}}>
          {/* <h1>Short Trip to Thailand</h1> */}
          <Planner id={this.props.match.params.itineraryId} />
        </div>
        <div style={{display: 'inline-block', width: '15vw', verticalAlign: 'top', position: 'sticky', top: '0px'}}>
          <h1 style={{textAlign: 'center'}}>Bucket</h1>
          {/* <BucketList /> */}
        </div>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(PlannerPage)
