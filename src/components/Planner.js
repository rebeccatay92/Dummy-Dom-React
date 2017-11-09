import React, { Component } from 'react'
import Radium from 'radium'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { initializePlanner } from '../actions/plannerActions'
import { queryItinerary } from '../apollo/itinerary'
import { Image } from 'react-bootstrap'
import { Scrollbars } from 'react-custom-scrollbars'
import DateBox from './Date'

const iconStyle = {
  fontSize: '24px',
  marginLeft: '2vh',
  color: '#EDB5BF',
  opacity: '0.6',
  cursor: 'pointer',
  ':hover': {
    opacity: '1'
  }
}

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
      <div style={{
        height: '90vh',
        width: '100%',
        borderRight: '1px solid rgba(159, 172, 188, 0.5)'
      }}>
        <Scrollbars renderThumbVertical={({ style }) =>
          <div style={{ ...style, backgroundColor: '#EDB5BF', right: '-4px' }} />
        } renderThumbHorizontal={({ style }) =>
          <div style={{ ...style, display: 'none' }} />
        }
          renderTrackVertical={({style}) =>
          <div style={{ ...style, top: 0, right: 0, width: '10px', height: '100%' }} />
        } thumbSize={60} >
          <div style={{
            paddingRight: '44px',
            paddingLeft: '10px'
          }}>
            <div style={{marginLeft: '89px'}}>
              <h1 style={{fontSize: '56px', fontWeight: '100', marginTop: '0'}}>{this.props.data.findItinerary.name}</h1>
              <p style={{margin: '0 0 2vh 0', fontSize: '16px', fontWeight: '100', color: '#9FACBC'}}>Just a short getaway, 5D4N to DomLand, maybe we can see some Dominics whoop whoop!</p>
              <div style={{position: 'relative', height: '4vh', margin: '0 0 2vh 0'}}>
                <div style={{position: 'absolute', left: '0', top: '0'}}>
                  <Image src='https://scontent-sin6-2.xx.fbcdn.net/v/t1.0-9/14225571_677406772406900_4575646425482055747_n.jpg?oh=935665cd290c11b5c698a4b91772fe91&oe=5AACAA18' circle style={{height: '30px', width: '30px', margin: '0 0 10px 10px'}} />
                  <Image src='https://scontent-sin6-2.xx.fbcdn.net/v/t1.0-9/13335715_630881200392791_5149958966299133966_n.jpg?oh=c360bd9cf2063d1daf86cd294e3e231f&oe=5A9CF157' circle style={{height: '30px', width: '30px', margin: '0 0 10px 10px'}} />
                  <Image src='https://media.licdn.com/media/AAEAAQAAAAAAAAqQAAAAJDhmZmZhOTg2LWE1YmYtNDQ2OC1iMzhiLWU0Y2RiZTBmNGRkMw.jpg' circle style={{height: '30px', width: '30px', margin: '0 0 10px 10px'}} />
                  <i className='material-icons' style={{...iconStyle, ...{verticalAlign: 'middle', marginLeft: '10px'}}}>add</i>
                </div>
                <div style={{position: 'absolute', right: '0', bottom: '0'}}>
                  <i className='material-icons' style={iconStyle} key={1}>line_weight</i>
                  <i className='material-icons' style={iconStyle} key={2}>share</i>
                  <i className='material-icons' style={iconStyle} key={3}>map</i>
                </div>
              </div>
            </div>
            {/* <h4 style={{lineHeight: '-0px'}}>{this.props.data.findItinerary.countries[0].name}</h4> */}
            {/* <button onClick={() => this.setState({draggable: !this.state.draggable})}>{this.state.draggable ? 'Rearrange Mode: On' : 'Rearrange Mode: Off'}</button> */}
            <div>
              {newDates.map((date, i) => {
                return (
                  <DateBox itineraryId={this.props.id} date={date} activities={this.props.activities.filter(
                    activity => {
                      let activityDate = activity.date || activity.departureDate || activity.startDate || activity.endDate
                      return activityDate * 1000 === date
                    }
                  )} draggable={this.state.draggable} key={i} day={i + 1} firstDay={i === 0} />
                )
              })}
            </div>
          </div>
        </Scrollbars>
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

export default connect(mapStateToProps, mapDispatchToProps)(graphql(queryItinerary, options)(Radium(Planner)))
