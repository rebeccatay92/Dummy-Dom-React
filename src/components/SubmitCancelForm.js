import React, { Component } from 'react'

// SUBMIT AND CANCEL ACTIONS ARE DEFINED DEPENDING ON THE PARENT FORM

class SubmitCancelForm extends Component {
  render () {
    return (
      <div style={{position: 'absolute', top: '20px', right: '20px', color: '#9FACBC'}}>
        <i onClick={() => this.props.handleSubmit()} className='material-icons' style={{marginRight: '5px', cursor: 'pointer'}}>done</i>
        <i onClick={() => this.props.closeCreateForm()} className='material-icons' style={{cursor: 'pointer'}}>clear</i>
      </div>
    )
  }
}

export default SubmitCancelForm
