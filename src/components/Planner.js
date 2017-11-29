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
    //
    // console.log('apollo', this.props.data.findItinerary)

    const startDate = new Date(this.props.data.findItinerary.startDate * 1000)
    const days = this.props.data.findItinerary.days
    const getDates = (startDate, days) => {
      let dateArray = []
      let currentDate = new Date(startDate)
      while (dateArray.length < days) {
        dateArray.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      return dateArray
    }
    const dates = getDates(startDate, days)
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
        } thumbSize={60} onScroll={(e) => this.handleScroll(e)}>
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
                  <DateBox days={days} timelineAtTop={this.state.timelineAtTop} dateOffsets={this.state.dateOffsets || {'day 1': true}} itineraryId={this.props.id} day={i + 1} date={date} dates={dates} countries={this.props.data.findItinerary.countries} activities={this.props.activities.filter(
                    activity => {
                      let activityDay = activity.day || activity.departureDay || activity.startDay || activity.endDay
                      return activityDay === i + 1
                    }
                  )} draggable={this.state.draggable} key={i} firstDay={i === 0} lastDay={i === newDates.length - 1} />
                )
              })}
            </div>
          </div>
        </Scrollbars>
      </div>
    )
  }

  handleScroll (e) {
    function offset (el) {
      const rect = el.getBoundingClientRect(),
      scrollTop = window.pageYOffset || document.documentElement.scrollTop
      return { top: rect.top + scrollTop - 76 }
    }

    var div = document.querySelector('#timeline-top')
    var divOffset = offset(div)
    const days = this.props.data.findItinerary.days
    let obj = {}
    for (var i = 1; i <= days; i++) {
      var dateDiv = document.querySelector(`#day-${i}`)
      if (i === 1 || offset(dateDiv).top < 50) {
        Object.keys(obj).forEach(key => {
          obj[key] = false
        })
        obj[`day ${i}`] = i === 1 ? true : offset(dateDiv).top < 50
      }
    }
    this.setState({
      timelineAtTop: divOffset.top < 0,
      dateOffsets: obj
    })
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
          endDay: lodging.endDay,
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
