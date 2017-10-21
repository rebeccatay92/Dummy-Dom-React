import React, { Component } from 'react'
import DateBox from './Date'

class Planner extends Component {
  constructor (props) {
    super(props)

    this.state = {
      draggable: false
    }
  }

  render () {
    const startDate = new Date(2017, 10, 19)
    const endDate = new Date(2017, 10, 21)
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
      return date.toDateString()
    })
    return (
      <div>
        <button onClick={() => this.setState({draggable: !this.state.draggable})}>{this.state.draggable ? 'Rearrange Mode: On' : 'Rearrange Mode: Off'}</button>
        {newDates.map((date, i) => {
          return (
            <DateBox date={date} draggable={this.state.draggable} key={i} day={i + 1} />
          )
        })}
      </div>
    )
  }
}

export default Planner
