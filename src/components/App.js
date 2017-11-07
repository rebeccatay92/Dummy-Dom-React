import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import HomePage from './HomePage'
import ItineraryPage from './ItineraryPage'
import PlannerPage from './PlannerPage'
import Search from './Search'
import Navbar from './Navbar'

class App extends Component {
  render () {
    return (
      <Router>
        <div style={{backgroundColor: '#FAFAFA'}}>
          {Navbar}
          <Route exact path='/' component={() => (
            <HomePage />
          )} />
          <Route path='/itineraries' component={() => (
            <ItineraryPage />
          )} />
          <Route path='/search' component={() => (
            <Search />
          )} />
          <Route path='/planner/:itineraryId' component={PlannerPage} />
        </div>
      </Router>
    )
  }
}

export default App
