import React, { Component } from 'react'
import DateBox from './Date'
// import PlannerActivity from './PlannerActivity'
// import { DropTarget } from 'react-dnd'
// import { connect } from 'react-redux'
// import { addActivity, deleteActivity, hoverOutsidePlanner } from '../actions/plannerActions'
// import { addActivityToBucket, deleteActivityFromBucket } from '../actions/bucketActions'

// const plannerTarget = {
//   drop (props, monitor) {
//     if (props.activities.length === 0) {
//       props.addActivity(monitor.getItem())
//       props.deleteActivityFromBucket(monitor.getItem())
//     }
//   }
// }
//
// function collect (connect, monitor) {
//   return {
//     connectDropTarget: connect.dropTarget(),
//     isOver: monitor.isOver()
//   }
// }

class Planner extends Component {
  constructor (props) {
    super(props)

    this.state = {
      draggable: false
    }
  }

  // handleClick (activity) {
  //   this.props.deleteActivity(activity)
  //   this.props.addActivityToBucket(activity)
  // }

  render () {
    // const { connectDropTarget, isOver } = this.props
    // let preview
    // if (isOver && this.props.activities.length === 0) {
    //   preview = (
    //     <div style={{border: '1px dashed green', height: '12vh'}} />
    //   )
    // }
    // Seeding Dates
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
    // console.log(newDates)
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

  // componentWillReceiveProps (nextProps) {
  //   if (nextProps.isOver === !this.props.isOver) {
  //     if (!nextProps.isOver) this.props.hoverOutsidePlanner()
  //   }
  // }
}

// const mapStateToProps = (state) => {
//   return {
//     activities: state.plannerActivities
//   }
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return {
//     addActivity: (activity) => {
//       dispatch(addActivity(activity))
//     },
//     deleteActivity: (activity) => {
//       dispatch(deleteActivity(activity))
//     },
//     addActivityToBucket: (activity) => {
//       dispatch(addActivityToBucket(activity))
//     },
//     deleteActivityFromBucket: (activity) => {
//       dispatch(deleteActivityFromBucket(activity))
//     },
//     hoverOutsidePlanner: () => {
//       dispatch(hoverOutsidePlanner())
//     }
//   }
// }

export default Planner
