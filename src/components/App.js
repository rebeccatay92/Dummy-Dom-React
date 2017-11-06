import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { createToken } from '../apollo/user'
import { loginUser, logoutUser } from '../actions/userActions'

import HomePage from './HomePage'
import ItineraryPage from './ItineraryPage'
import PlannerPage from './PlannerPage'
import Navbar from './Navbar'

class App extends Component {
  constructor (props) {
    super(props)
    // this.state = {
    //   token: null
    // }
  }
  toggleLoginLogout () {
    if (!this.props.token) {
      console.log('logging in')
      this.props.createToken({
        variables: {
          email: 'Rene_Kohler@gmail.com',
          password: 'password1'
        }
      })
        .then(({data}) => {
          console.log('token', data.createToken.token)
          window.localStorage.setItem('token', data.createToken.token)
          this.props.loginUser()
        })
    } else {
      console.log('logging out')
      window.localStorage.removeItem('token')
      this.props.logoutUser()
    }
  }

  render () {
    return (
      <Router>
        <div>
          {Navbar}
          <div style={{border: '1px solid red'}}>
            <button onClick={() => this.toggleLoginLogout()}>Fake login/logout toggle</button>
            <h4>Token: {this.props.token}</h4>
          </div>
          <Route exact path='/' component={() => (
            <HomePage />
          )} />
          <Route path='/itineraries' component={() => (
            <ItineraryPage />
          )} />
          <Route path='/planner/:itineraryId' component={PlannerPage} />
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
    loginUser: () => {
      dispatch(loginUser())
    },
    logoutUser: () => {
      dispatch(logoutUser())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(createToken, {name: 'createToken'})(App))
