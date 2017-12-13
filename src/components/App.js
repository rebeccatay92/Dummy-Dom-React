import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

import { createToken } from '../apollo/user'

import { initializeUser, logoutUser } from '../actions/userActions'

import HomePage from './HomePage'
import ItineraryPage from './itinerary/ItineraryPage'
import PlannerPage from './PlannerPage'
import Navbar from './Navbar'
import LocationMapHOC from './location/LocationMapHOC'

class App extends Component {
  toggleLoginLogout () {
    if (!this.props.token) {
      console.log('logging in')
      this.props.createToken({
        variables: {
          email: 'Tara_Schowalter@gmail.com',
          password: 'password1'
        }
      })
        .then(({data}) => {
          window.localStorage.setItem('token', data.createToken)
          this.props.initializeUser()
        })
    } else {
      console.log('logging out')
      window.localStorage.removeItem('token')
      this.props.logoutUser()
    }
  }

  componentDidMount () {
    this.props.initializeUser()
  }

  render () {
    return (
      <Router>
        <div style={{backgroundColor: '#FAFAFA', overflowX: 'hidden'}}>
          {Navbar}
          {/* <div style={{border: '1px solid red'}}>
            <button onClick={() => this.toggleLoginLogout()}>Fake login/logout toggle. User 1's token. change toggleLoginLogout email to your own seeded user 1's.</button>
            <h4>Token: {this.props.token}</h4>
          </div> */}
          <Route exact path='/' component={() => (
            <HomePage />
          )} />
          <Route path='/itineraries' component={() => (
            <ItineraryPage />
          )} />
          <Route path='/planner/:itineraryId' component={PlannerPage} />
          <Route path='/maps' component={LocationMapHOC} />
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeUser: () => {
      dispatch(initializeUser())
    },
    logoutUser: () => {
      dispatch(logoutUser())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(createToken, {name: 'createToken'})
)(App))
