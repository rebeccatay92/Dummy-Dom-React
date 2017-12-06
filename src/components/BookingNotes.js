import React, { Component } from 'react'

const labelStyle = {
  fontSize: '13px',
  display: 'block',
  margin: '0',
  lineHeight: '26px'
}

class BookingNotes extends Component {
  render () {
    return (
      <div>
        <h4 style={{fontSize: '24px'}}>Booking Details</h4>
        <label style={labelStyle}>
            Booking Service
          </label>
        <input style={{width: '100%'}} type='text' name='bookedThrough' onChange={(e) => this.props.handleChange(e, 'bookedThrough')} />
        <label style={labelStyle}>
            Confirmation Number
          </label>
        <input style={{width: '100%'}} type='text' name='bookingConfirmation' onChange={(e) => this.props.handleChange(e, 'bookingConfirmation')} />
        <label style={labelStyle}>
            Amount:
          </label>
        <select style={{height: '25px', borderRight: '0', background: 'white', width: '20%'}} name='currency' value={this.props.currency} onChange={(e) => this.props.handleChange(e, 'currency')}>
          {this.props.currencyList.map((e, i) => {
            return <option key={i}>{e}</option>
          })}
        </select>
        <input style={{width: '80%'}} type='number' name='cost' value={this.props.cost} onChange={(e) => this.props.handleChange(e, 'cost')} />
        <h4 style={{fontSize: '24px', marginTop: '50px'}}>
            Additional Notes
        </h4>
        <label style={labelStyle}>
            Detailed Location
        </label>
        <input className='form-input' style={{width: '100%'}} type='text' placeholder='(Optional)' />
        <label style={labelStyle}>
            Notes:
        </label>
        <textarea type='text' name='notes' onChange={(e) => this.props.handleChange(e, 'notes')} style={{width: '200px', height: '100px', display: 'block'}} />
      </div>
    )
  }
}

export default BookingNotes
