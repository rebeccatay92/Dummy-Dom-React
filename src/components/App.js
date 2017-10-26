import React, { Component } from 'react'
import Planner from './Planner'
// import BucketList from './BucketList'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

class App extends Component {

  render () {
    return (
      <Router>
        <div style={{fontFamily: 'Helvetica'}}>
          <div style={{display: 'inline-block', width: '80vw', verticalAlign: 'top', marginRight: '1vw'}}>
            <Route exact path='/itinerary/:itineraryId' component={Planner} />
          </div>
          <div style={{display: 'inline-block', width: '15vw', verticalAlign: 'top', position: 'sticky', top: '0px'}}>
            <h1 style={{textAlign: 'center'}}>Bucket</h1>
            {/* <BucketList /> */}
          </div>
        </div>
      </Router>
    )
  }
}

export default (DragDropContext(HTML5Backend)(App))
