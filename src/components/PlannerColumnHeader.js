import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeColumns } from '../actions/plannerColumnActions'
import onClickOutside from 'react-onclickoutside'

const dropdownStyle = {
  display: 'inline-block',
  fontSize: '16px',
  color: '#9FACBC',
  cursor: 'pointer'
}

const optionStyle = {
  display: 'block',
  fontSize: '16px',
  textAlign: 'left',
  color: '#9FACBC',
  margin: '1vh 0',
  cursor: 'pointer'
}

const options = ['Price', 'Booking Status', 'Booking Platform', 'Notes'].sort()

class PlannerColumnHeader extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dropdown: false
    }
  }

  render () {
    if (!this.state.dropdown) {
      return (
        <th style={{width: '20%', textAlign: 'center'}}>
          <span onClick={() => this.setState({dropdown: !this.state.dropdown})} style={dropdownStyle}>{this.props.column}<i className='material-icons' style={{fontSize: '24px', verticalAlign: 'middle'}} onClick={() => this.setState({dropdown: !this.state.dropdown})}>keyboard_arrow_down</i></span>
        </th>
      )
    } else if (this.state.dropdown) {
      return (
        <th style={{width: '20%', textAlign: 'center', position: 'relative'}}>
          <div style={{width: '100%', border: '1px solid #9FACBC', position: 'absolute', top: '0', backgroundColor: 'white'}}>
            <span onClick={() => this.setState({dropdown: !this.state.dropdown})} style={dropdownStyle}>{this.props.column}<i className='material-icons' style={{fontSize: '24px', verticalAlign: 'middle'}}>keyboard_arrow_down</i></span>
            <div style={{width: '95%', margin: '3vh auto 0 auto'}}>
              {options.filter(option => option !== this.props.column).map((option, i) => {
                // if (this.props.index !== 0 && option === 'Notes') return null
                return (
                  <span style={optionStyle} onClick={() => this.handleClick(option)}>{option}</span>
                )
              })}
            </div>
          </div>
        </th>
      )
    }
  }

  handleClick (option) {
    let newArr = this.props.columns.map((column, i) => {
      if (i === this.props.index || column === 'Notes') return option
      else return column
    })
    this.props.changeColumns(newArr)
    this.setState({
      dropdown: false
    })
  }

  handleClickOutside (event) {
    this.setState({
      dropdown: false
    })
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeColumns: (columns) => {
      dispatch(changeColumns(columns))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.plannerColumns
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(PlannerColumnHeader))
