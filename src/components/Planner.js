import React, { Component } from 'react'
import DateBox from './Date'
import { graphql } from 'react-apollo'
import { initializePlanner } from '../actions/plannerActions'
import { connect } from 'react-redux'
import { queryItinerary } from '../apollo/itinerary'

class Planner extends Component {
  constructor (props) {
    super(props)

    this.state = {
      draggable: true
    }
  }

  render () {
    if (this.props.data.loading) return (<h1>Loading</h1>)
    const startDate = new Date(this.props.data.findItinerary.startDate * 1000)
    const endDate = new Date(this.props.data.findItinerary.endDate * 1000)
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
    const newDates = dates.map((date) => {
      return date.getTime()
    })
    return (
      <div>
        <h1>{this.props.data.findItinerary.name}</h1>
        <h4 style={{lineHeight: '-0px'}}>{this.props.data.findItinerary.countries[0].name}</h4>
        {/* <button onClick={() => this.setState({draggable: !this.state.draggable})}>{this.state.draggable ? 'Rearrange Mode: On' : 'Rearrange Mode: Off'}</button> */}
        {newDates.map((date, i) => {
          return (
            <DateBox itineraryId={this.props.id} date={date} activities={this.props.activities.filter(
              activity => {
                let activityDate = activity.date || activity.departureDate || activity.startDate || activity.endDate
                return activityDate * 1000 === date
              }
            )} draggable={this.state.draggable} key={i} day={i + 1} />
          )
        })}
      </div>
    )
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data.findItinerary !== nextProps.data.findItinerary) {
      let lodgingCheckout = nextProps.data.findItinerary.lodgings.map(lodging => {
        return {
          id: lodging.id,
          name: lodging.name,
          location: {
            name: lodging.location.name
          },
          endDate: lodging.endDate,
          endTime: lodging.endTime,
          __typename: lodging.__typename,
          endLoadSequence: lodging.endLoadSequence
        }
      })
      let allActivities = [...nextProps.data.findItinerary.activities, ...nextProps.data.findItinerary.flights, ...nextProps.data.findItinerary.food, ...nextProps.data.findItinerary.lodgings, ...nextProps.data.findItinerary.transports, ...lodgingCheckout]
      console.log(allActivities)
      this.props.initializePlanner(allActivities)
    }
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.id
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
