import React, { Component } from 'react'
import Radium from 'radium'
import { connect } from 'react-redux'
import { changeColumns } from '../actions/plannerColumnActions'
import onClickOutside from 'react-onclickoutside'

const dropdownStyle = {
  display: 'inline-block',
  fontSize: '16px',
  color: '#9FACBC',
  cursor: 'pointer',
  padding: '1vh'
}

const optionStyle = {
  display: 'block',
  fontSize: '16px',
  textAlign: 'left',
  color: '#9FACBC',
  margin: '1vh 0',
  cursor: 'pointer'
}

const tableHeadingStyle = {
  width: '20%',
  textAlign: 'center',
  position: 'relative',
  backgroundColor: '#FAFAFA',
  ':hover': {
    backgroundColor: '#f0f0f0'
  }
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
    const notesIsVisible = this.props.columns.includes('Notes') && this.props.column !== 'Notes'
    if (!this.state.dropdown) {
      return (
        <th style={tableHeadingStyle}>
          <span onClick={() => {
            if (notesIsVisible) return
            this.setState({dropdown: !this.state.dropdown})
          }} style={{...dropdownStyle, ...{opacity: notesIsVisible ? 0.3 : 1, cursor: notesIsVisible ? 'auto' : 'pointer'}}}>{this.props.column}<i className='material-icons' style={{fontSize: '24px', verticalAlign: 'middle'}}>keyboard_arrow_down</i></span>
        </th>
      )
    } else if (this.state.dropdown) {
      return (
        <th style={tableHeadingStyle}>
          <div style={{width: '100%', border: '1px solid #9FACBC', position: 'absolute', top: '-1px', backgroundColor: 'white'}}>
            <span onClick={() => this.setState({dropdown: !this.state.dropdown})} style={dropdownStyle}>{this.props.column}<i className='material-icons' style={{fontSize: '24px', verticalAlign: 'middle'}}>keyboard_arrow_down</i></span>
            <div style={{width: '95%', margin: '1vh auto 0 auto'}}>
              {options.filter(option => option !== this.props.column).map((option, i) => {
                // if (this.props.index !== 0 && option === 'Notes') return null
                return (
                  <span key={i} style={optionStyle} onClick={() => this.handleClick(option)}>{option}</span>
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
      dropdown: false,
      _radiumStyleState: {}
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

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(Radium(PlannerColumnHeader)))
