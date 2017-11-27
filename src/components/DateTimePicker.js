import React, { Component } from 'react'
import PlannerDatePicker from './PlannerDatePicker'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import moment from 'moment'
import Radium, { Style } from 'radium'

class DateTimePicker extends Component {
  render () {
    return (
      <div style={{width: '238px', margin: '45px auto 0 auto', textAlign: 'center', border: '0.3px solid white', height: '131px', position: 'relative'}}>
        <div className='planner-date-picker'>
          <select key={12345} name='startDay' onChange={(e) => this.props.handleChange(e, 'startDay')} value={this.props.startDay} style={{background: 'inherit', border: 'none', outline: 'none', fontSize: '24px', fontWeight: 100, margin: '10px 5px 10px 0px', ':hover': { outline: '0.3px solid white' }}}>
            {this.props.dates.map((indiv, i) => {
              return <option style={{background: '#6D6A7A'}} value={i + 1} key={i}>Day {i + 1}</option>
            })}
          </select>
          <DatePicker customInput={<PlannerDatePicker backgroundImage={this.props.backgroundImage} />} selected={this.props.startDate} dateFormat={'ddd DD MMM YYYY'} minDate={moment.unix(this.props.dates[0])} maxDate={moment.unix(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.props.handleChange(e, 'startDate')} />
        </div>
        <div className='planner-time-picker'>
          <input style={{background: 'inherit', fontSize: '16px', outline: 'none', border: 'none', textAlign: 'center'}} type='time' name='startTime' value={this.props.startTime} onChange={(e) => this.props.handleChange(e, 'startTime')} /> <span>to</span>
          <input style={{background: 'inherit', fontSize: '16px', outline: 'none', border: 'none', textAlign: 'center'}} type='time' name='endTime' value={this.props.endTime} onChange={(e) => this.props.handleChange(e, 'endTime')} />
        </div>
        <div className='planner-date-picker'>
          <select key={12346} name='endDay' onChange={(e) => this.props.handleChange(e, 'endDay')} value={this.props.endDay} style={{background: 'inherit', border: 'none', outline: 'none', fontSize: '24px', fontWeight: 100, margin: '10px 5px 10px 0px', ':hover': { outline: '0.3px solid white' }}}>
            {this.props.dates.map((indiv, i) => {
              if (i + 1 >= this.props.startDay) {
                return <option style={{background: '#6D6A7A'}} value={i + 1} key={i}>Day {i + 1}</option>
              }
            })}
          </select>
          <DatePicker customInput={<PlannerDatePicker backgroundImage={this.props.backgroundImage} />} selected={this.props.endDate} dateFormat={'ddd DD MMM YYYY'} minDate={this.props.startDate} maxDate={moment.unix(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.props.handleChange(e, 'endDate')} />
        </div>
      </div>
    )
  }
}

export default Radium(DateTimePicker)
