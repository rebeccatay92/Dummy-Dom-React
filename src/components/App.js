import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import HomePage from './HomePage'
import ItineraryPage from './ItineraryPage'
import PlannerPage from './PlannerPage'

class App extends Component {

  render () {
    return (
      <Router>
        <div>
          <Route exact path='/' component={() => (
            <HomePage />
          )
        } />
          <Route path='/itineraries' component={() => (
            <ItineraryPage />
        )} />
          <Route path='/dnd' component={() => (
            <PlannerPage />
        )} />
        </div>
      </Router>
    )
  }
}

export default App
