import React, { Component } from 'react'

class ImagePreview extends Component {
  render () {
    return (
      <div style={{background: 'black', position: 'fixed', left: '10%', top: '10%', zIndex: '9999', height: '80%', width: '80%', textAlign: 'center'}}>
        <img src={this.props.previewUrl} alt='preview' style={{maxWidth: '100%', maxHeight: '100%'}} />
      </div>
    )
  }
}

export default ImagePreview