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
        <textarea type='text' name='notes' value={this.props.notes} onChange={(e) => this.props.flight ? this.props.handleChange(e, 'flightInstances', 'notes', this.props.index) : this.props.handleChange(e, 'notes')} style={{width: '100%', height: '100px', display: 'block'}} />
      </div>
    )
  }
}

export default Notes
