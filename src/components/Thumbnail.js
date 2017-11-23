import React, {Component} from 'react'

class Thumbnail extends Component {
  render () {
    return (
      <div style={{display: 'block', position: 'relative', left: `${this.props.offset}`}}>
        <img src={this.props.thumbnailUrl} alt='thumbnail' width='auto' height='auto' style={{maxWidth: '200px', maxHeight: '200px'}} />
      </div>
    )
  }
}

export default Thumbnail
