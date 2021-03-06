import React, { Component } from 'react'
import { connect } from 'react-redux'
import { primaryColor } from '../Styles/styles'

const timelineIconStyle = {
  fontSize: '24px',
  WebkitTextStroke: '1px ' + primaryColor,
  WebkitTextFillColor: '#FAFAFA'
}

const endStyle = {
  WebkitTextStroke: '1px ' + primaryColor,
  WebkitTextFillColor: primaryColor
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

  renderDuration (duration, style, doNotShowTime) {
    if (this.props.draggingItem || doNotShowTime || (!Math.floor(duration / 3600) && !Math.floor((duration % 3600) / 60))) {
      return (
        <div style={{...{textAlign: 'center', position: 'relative', color: '#9FACBC', top: this.props.expanded ? '110px' : '3px', fontWeight: 'bold', padding: '2px 0'}, ...style}}>
          <span style={{opacity: '0'}}>empty string</span>
        </div>
      )
    }
    const time = {
      hours: Math.floor(duration / 3600) ? Math.floor(duration / 3600) + ' hr ' : null,
      minutes: Math.floor((duration % 3600) / 60) + ' min'
    }
    return (
      <div style={{...{fontSize: '13px', textAlign: 'center', backgroundColor: '#FAFAFA', position: 'relative', color: '#9FACBC', top: this.props.expanded ? '110px' : '3px', fontWeight: 'bold', padding: '2px 0', zIndex: 1}, ...style}}>
        <span style={{color: this.props.isLast && this.props.lastDay ? '#FAFAFA' : '#9FACBC'}}>{time.hours}{time.minutes}</span>
      </div>
    )
  }

  renderTimeline (type) {
    const daySortedActivities = this.props.activities.concat()
    // .sort(
    //   (a, b) => {
    //     return a.day - b.day
    //   }
    // )
    let timeOfNextActivity, indexOfNextActivity, doNotShowTime
    if (this.props.draggingItem) {
      indexOfNextActivity = 0
    } else {
      indexOfNextActivity = daySortedActivities.findIndex(activity => {
        return activity === this.props.activity
      }) + 1
    }
    let dayAdjustedTime
    if (indexOfNextActivity === 0 || this.props.draggingItem) {
      dayAdjustedTime = this.props.endTime
    } else if (indexOfNextActivity >= this.props.activities.length) {
      dayAdjustedTime = this.props.endTime
    } else {
      const nextActivity = daySortedActivities[indexOfNextActivity]
      timeOfNextActivity = nextActivity.start || typeof nextActivity.start !== 'boolean' ? nextActivity[nextActivity.type]['startTime'] : nextActivity[nextActivity.type]['endTime']
      if (nextActivity.type === 'Flight') timeOfNextActivity = nextActivity.start || typeof nextActivity.start !== 'boolean' ? nextActivity[nextActivity.type].FlightInstance['startTime'] : nextActivity[nextActivity.type].FlightInstance['endTime']
      const dayOfNextActivity = nextActivity.day
      dayAdjustedTime = timeOfNextActivity + (dayOfNextActivity - this.props.day) * 86400
      if (nextActivity.timelineClash || nextActivity.inBetweenStartEndRow || nextActivity[nextActivity.type].allDayEvent) {
        doNotShowTime = true
      } else {
        doNotShowTime = false
      }
    }
    const endTime = this.props.start ? this.props.startTime : this.props.endTime
    switch (type) {
      case 'Activity':
        return (
          <div>
            {this.renderIcon('directions_run', this.props.expanded && {fontSize: '48px'})}
            {this.renderDuration(dayAdjustedTime - this.props.endTime, this.props.isLast && {top: this.props.expanded ? '165px' : '60px', zIndex: 1}, doNotShowTime || this.props.doNotShowTime)}
          </div>
        )
      case 'Food':
        return (
          <div>
            {this.renderIcon('restaurant', this.props.expanded && {fontSize: '48px'})}
            {this.renderDuration(dayAdjustedTime - this.props.endTime, this.props.isLast && {top: this.props.expanded ? '165px' : '60px', zIndex: 1}, doNotShowTime || this.props.doNotShowTime)}
          </div>
        )
      case 'Lodging':
        return (
          <div>
            {this.renderIcon('hotel', {...!this.props.start && endStyle, ...this.props.expanded && {fontSize: '48px'}})}
            {this.renderDuration(dayAdjustedTime - endTime, this.props.isLast && {top: this.props.expanded ? '165px' : '60px', zIndex: 1}, doNotShowTime || this.props.doNotShowTime)}
          </div>
        )
      case 'Flight':
        return (
          <div>
            {this.props.start && this.renderIcon('flight_takeoff', this.props.expanded && {fontSize: '48px'})}
            {this.props.start && this.renderDuration(dayAdjustedTime - this.props.startTime, this.props.isLast && {top: this.props.expanded ? '165px' : '60px', zIndex: 1}, doNotShowTime || this.props.doNotShowTime)}
            {!this.props.start && this.renderIcon('flight_land', {...endStyle, ...this.props.expanded && {fontSize: '48px'}})}
            {!this.props.start && this.renderDuration(dayAdjustedTime - this.props.endTime, this.props.isLast && {top: this.props.expanded ? '165px' : '60px', zIndex: 1}, doNotShowTime || this.props.doNotShowTime)}
          </div>
        )
      case 'LandTransport':
        return (
          <div>
            {this.props.start && this.renderIcon('local_car_wash', this.props.expanded && {fontSize: '48px'})}
            {this.props.start && this.renderDuration(dayAdjustedTime - this.props.startTime, this.props.isLast && {top: this.props.expanded ? '165px' : '60px', zIndex: 1}, doNotShowTime || this.props.doNotShowTime)}
            {!this.props.start && this.renderIcon('local_car_wash', {...endStyle, ...this.props.expanded && {fontSize: '48px'}})}
            {!this.props.start && this.renderDuration(dayAdjustedTime - this.props.endTime, this.props.isLast && {top: this.props.expanded ? '165px' : '60px', zIndex: 1}, doNotShowTime || this.props.doNotShowTime)}
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
