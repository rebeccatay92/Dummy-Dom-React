import React, { Component } from 'react'
import ImagePreview from './ImagePreview'
import Thumbnail from './Thumbnail'
import Radium, { Style } from 'radium'

class Attachments extends Component {
  render () {
    return (
      <div>
        {(this.props.attachments.length <= 4) &&
          <label style={{display: 'inline-block', color: 'black'}}>
            <i style={{color: '#EDB5BF', margin: '2px 5px 0 0', cursor: 'pointer'}} className='material-icons'>add_circle_outline</i>
            <input type='file' name='file' accept='.jpeg, .jpg, .png, .pdf' onChange={(e) => this.props.handleFileUpload(e)} style={{display: 'none'}} />
          </label>
        }
        {this.props.attachments.length > 4 &&
          <span style={{color: 'black'}}>Upload maxed</span>
        }
        {this.props.fileNames.map((name, i) => {
          return <div onMouseEnter={(event) => this.props.thumbnailMouseEnter(event, i)} onMouseLeave={(event) => this.props.thumbnailMouseLeave(event)} style={{margin: '1px 0 0 0', verticalAlign: 'top', display: 'inline-block', ':hover': {color: '#EDB5BF'}}} key={i}>
            <i className='material-icons' style={{color: '#EDB5BF'}}>folder</i>
            <span onClick={(e) => this.props.openPreview(e, i)} style={{fontSize: '14px', color: '#EDB5BF', fontWeight: 'bold', cursor: 'pointer', position: 'relative', top: '-6px'}}>{name}</span>
            <i className='material-icons' value={i} onClick={() => this.props.removeUpload(i)} style={{color: '#EDB5BF', opacity: this.props.hoveringOver === i ? '1.0' : 0}}>clear</i>
          </div>
        })}
        {this.props.thumbnail &&
          <Thumbnail thumbnailUrl={this.props.thumbnailUrl} offset={this.props.offset} />
        }
        {this.props.preview &&
          <div>
              {!this.props.previewUrl.match('.pdf') &&
              <div>
                <ImagePreview previewUrl={this.props.previewUrl} setBackground={(url) => this.props.setBackground(url)} />
              </div>
              }
            <div style={{position: 'fixed', left: '10%', top: '90%', zIndex: '9999', height: '5%', width: '80%'}}>
              <i className='material-icons' onClick={() => this.props.closePreview()} style={{color: 'black', cursor: 'pointer'}}>arrow_back</i>

              {this.props.fileNames.map((name, i) => {
                return (
                  <div key={i} style={{display: 'inline'}}>
                    <i className='material-icons' style={{color: '#EDB5BF'}}>folder</i>
                    <span key={i} onClick={(e) => this.props.changePreview(e, i)} style={{fontSize: '14px', color: '#EDB5BF', fontWeight: 'bold', cursor: 'pointer', position: 'relative', top: '-6px'}}>{name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Radium(Attachments)
