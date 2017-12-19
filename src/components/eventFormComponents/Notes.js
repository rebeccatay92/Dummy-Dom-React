import React, { Component } from 'react'

const labelStyle = {
  fontSize: '13px',
  display: 'block',
  margin: '0',
  lineHeight: '26px'
}

class Notes extends Component {
  render () {
    return (
      <div>
        <label style={labelStyle}>
            Notes:
        </label>
        <textarea type='text' name='notes' onChange={(e) => this.props.handleChange(e, 'notes')} style={{width: '200px', height: '100px', display: 'block'}} />
      </div>
    )
  }
}

export default Notes
