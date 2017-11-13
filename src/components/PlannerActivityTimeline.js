import React, { Component } from 'react'
import { connect } from 'react-redux'

const timelineIconStyle = {
  fontSize: '24px',
  WebkitTextStroke: '1px #EDB5BF',
  WebkitTextFillColor: '#FAFAFA'
}

const endStyle = {
  WebkitTextStroke: '1px #EDB5BF',
  WebkitTextFillColor: '#EDB5BF'
}

class PlannerActivityTimeline extends Component {
  render () {
    return this.renderTimeline(this.props.type)
  }

  renderIcon (string, style) {
    return (
      <div style={{height: '10vh', marginBottom: '-7px', position: 'relative'}}>
        <div style={{width: 'fit-content', margin: '0 auto', position: 'relative', backgroundColor: '#FAFAFA', top: '18px', padding: '5px'}}>
          <i className='material-icons' style={{...timelineIconStyle, ...style}}>{string}</i>
        </div>
      </div>
    )
  }

  renderDuration (duration, style) {
    if (this.props.draggingItem) {
      return (
        <div style={{...{textAlign: 'center', position: 'relative', color: '#9FACBC', top: '3px', fontWeight: 'bold', padding: '2px 0'}, ...style}}>
          {/* <span style={{color: this.props.isLast && this.props.lastDay ? '#FAFAFA' : '#9FACBC'}}>{time.hours}{time.minutes}</span> */}
        </div>
      )
    }
    const time = {
      hours: Math.floor(duration / 3600) ? Math.floor(duration / 3600) + ' hr ' : null,
      minutes: Math.floor((duration % 3600) / 60) + ' min'
    }
    return (
      <div style={{...{textAlign: 'center', backgroundColor: '#FAFAFA', position: 'relative', color: '#9FACBC', top: '3px', fontWeight: 'bold', padding: '2px 0'}, ...style}}>
        <span style={{color: this.props.isLast && this.props.lastDay ? '#FAFAFA' : '#9FACBC'}}>{time.hours}{time.minutes}</span>
      </div>
    )
  }

  renderTimeline (type) {
    const indexOfNextActivity = this.props.activities.sort(
      (a, b) => {
        const date = activity => {
          return activity.date || activity.startDate || activity.endDate || activity.departureDate
        }
        return date(a) - date(b)
      }
    ).findIndex(activity => {
      return activity.id === this.props.id && activity.__typename === this.props.type
    }) + 1
    let timeOfNextActivity
    if (indexOfNextActivity === 0 || this.props.draggingItem) {
      timeOfNextActivity = 0
    } else {
      const nextActivity = this.props.activities[indexOfNextActivity]
      timeOfNextActivity = nextActivity['startTime'] || nextActivity['departureTime'] || nextActivity['endTime']
    }
    switch (type) {
      case 'Activity':
        return (
          <div>
            {this.renderIcon('directions_run')}
            {this.renderDuration(timeOfNextActivity - this.props.endTime, this.props.isLast && {top: '60px', zIndex: 1})}
          </div>
        )
      case 'Food':
        return (
          <div>
            {this.renderIcon('restaurant')}
            {this.renderDuration(timeOfNextActivity - this.props.endTime, this.props.isLast && {top: '60px', zIndex: 1})}
          </div>
        )
      case 'Lodging':
        return (
          <div>
            {this.renderIcon('hotel', this.props.checkout && endStyle)}
            {this.renderDuration(timeOfNextActivity - this.props.endTime, this.props.isLast && {top: '60px', zIndex: 1})}
          </div>
        )
      case 'Flight':
        return (
          <div>
            {this.renderIcon('flight_takeoff')}
            {this.renderDuration(this.props.endTime - this.props.startTime)}
            {this.renderIcon('flight_land')}
            {this.renderDuration(timeOfNextActivity - this.props.endTime, this.props.isLast && {top: '60px', zIndex: 1})}
          </div>
        )
      case 'Transport':
        return (
          <div>
            {this.renderIcon('directions_subway')}
            {this.renderDuration(this.props.endTime - this.props.startTime)}
            {this.renderIcon('directions_subway', endStyle)}
            {this.renderDuration(timeOfNextActivity - this.props.endTime, this.props.isLast && {top: '60px', zIndex: 1})}
          </div>
        )
      default:
        return ''
    }
  }
}

const mapStateToProps = (state) => {
  return {
    activities: state.plannerActivities
  }
}

export default connect(mapStateToProps)(PlannerActivityTimeline)
