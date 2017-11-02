import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

class AddCountry extends Component {
  constructor (props) {
    super(props)
    this.state = {
      countryCode: ''
    }
  }

  handleChange (e) {
    this.setState({countryCode: e.target.value})
  }

  handleSubmit (e) {
    e.preventDefault()
    console.log('countryCode is', this.state.countryCode)
  }

  render () {
    return (
      <div>
        <h3>ItineraryId: {this.props.ItineraryId}</h3>
        <form>
          <input type='text' onChange={(e) => this.handleChange(e)} />
          <button type='submit' onClick={(e) => this.handleSubmit(e)}>Add country by countryCode</button>
        </form>
      </div>
    )
  }
}

export default AddCountry
