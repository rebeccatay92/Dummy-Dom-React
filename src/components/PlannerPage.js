import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Planner from './Planner'
// import BucketList from './BucketList'

const plannerStyles = {
  fontFamily: '\'Roboto\', sans-serif',
  color: '#3C3A44',
  margin: '0 auto',
  width: '1445px'
}

class PlannerPage extends Component {
  render () {
    return (
      <div style={plannerStyles}>
        <div style={{display: 'inline-block', width: '1096px', verticalAlign: 'top'}}>
          {/* <h1>Short Trip to Thailand</h1> */}
          <Planner id={this.props.match.params.itineraryId} />
        </div>
        <div style={{display: 'inline-block', width: '349px', verticalAlign: 'top', position: 'sticky', top: '0px'}}>
          <p style={{textAlign: 'center', fontSize: '24px'}}>BUCKETLIST</p>
          {/* <BucketList /> */}
        </div>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(PlannerPage)
