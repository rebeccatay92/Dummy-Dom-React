import React, { Component } from 'react'
import DateBox from './Date'
import { gql, graphql } from 'react-apollo'
import { initializePlanner } from '../actions/plannerActions'
import { connect } from 'react-redux'

class Planner extends Component {
  constructor (props) {
    super(props)

    this.state = {
      draggable: false
    }
  }

  render () {
    if (this.props.data.loading) return (<h1>Loading</h1>)
    const startDate = new Date(this.props.data.findItinerary.startDate * 1000)
    const endDate = new Date(this.props.data.findItinerary.endDate * 1000)
    // console.log(this.props.data.findItinerary.startDate, this.props.data.findItinerary.endDate);
    // console.log(startDate, endDate);
    const getDates = (startDate, stopDate) => {
      let dateArray = []
      let currentDate = new Date(startDate)
      while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      return dateArray
    }
    const dates = getDates(startDate, endDate)
    // console.log(dates);
    const newDates = dates.map((date) => {
      return date.getTime()
    })
    return (
      <div>
        <h1>{this.props.data.findItinerary.name}</h1>
        <button onClick={() => this.setState({draggable: !this.state.draggable})}>{this.state.draggable ? 'Rearrange Mode: On' : 'Rearrange Mode: Off'}</button>
        {newDates.map((date, i) => {
          return (
            <DateBox itineraryId={this.props.match.params.itineraryId} date={date} activities={this.props.activities.filter(activity => activity.date * 1000 === date)} draggable={this.state.draggable} key={i} day={i + 1} />
          )
        })}
      </div>
    )
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data.findItinerary !== nextProps.data.findItinerary) {
      this.props.initializePlanner(nextProps.data.findItinerary.activities)
    }
  }
}

const queryItinerary = gql`
  query queryItinerary($id: ID!) {
    findItinerary(id: $id){
      startDate
      endDate
      name
      activities {
        id
        name
        location {
          name
        }
        date
      }
  }
}`

const options = {
  options: props => ({
    variables: {
      id: props.match.params.itineraryId
    }
  })
}

const mapStateToProps = (state) => {
  return {
    activities: state.plannerActivities
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializePlanner: (activities) => {
      dispatch(initializePlanner(activities))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(queryItinerary, options)(Planner))
