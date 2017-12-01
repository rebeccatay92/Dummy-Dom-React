import React, { Component } from 'react'
import ImagePreview from './ImagePreview'
import Thumbnail from './Thumbnail'
import Radium, { Style } from 'radium'
import { primaryColor } from '../Styles/styles'

class Attachments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      thumbnail: false,
      thumbnailUrl: null,
      hoveringOver: null, // determining which file's X icon to display
      preview: false,
      previewUrl: null
    }
  }

  thumbnailMouseEnter (event, i) {
    var fileName = this.props.attachments[i]
    this.setState({hoveringOver: i})

    if (fileName.match('.pdf')) {
      var url = 'http://media.idownloadblog.com/wp-content/uploads/2016/04/52ff0e80b07d28b590bbc4b30befde52.png'
    } else {
      url = `https://storage.cloud.google.com/domatodevs/${fileName}`
    }
    this.setState({thumbnailUrl: url})
    this.setState({thumbnail: true})
  }

  thumbnailMouseLeave (event) {
    this.setState({thumbnail: false})
    this.setState({thumbnailUrl: null})
    this.setState({hoveringOver: null})
  }

  openPreview (event, i) {
    var fileName = this.props.attachments[i]
    var url = `https://storage.cloud.google.com/domatodevs/${fileName}`

    // fileName = fileName.replace('/', '%2F')
    //
    // fetch(`https://www.googleapis.com/storage/v1/b/domatodevs/o/${fileName}?alt=media`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${this.apiToken}`
    //   }
    // })
    // .then(response => {
    //   let result
    //   const reader = response.body.getReader()
    //   reader.read().then(function processText ({ done, value }) {
    //     if (done) {
    //       console.log('Stream complete')
    //       // console.log('complete result', result)
    //       // console.log('typeof', typeof (result))
    //       var scrub = result.substring(9)
    //       scrub = scrub.split(',')
    //       var array = JSON.parse('[' + scrub + ']')
    //       // console.log(array)
    //       var int8arr = Uint8Array.from(array)
    //       console.log(int8arr)
    //       PDFJS.getDocument(int8arr).then(function (pdf) {
    //         pdf.getPage(1).then(function (page) {
    //           console.log(page.toDataURL())
    //         })
    //       })
    //       return
    //     }
    //     result += value
    //
    //     return reader.read().then(processText)
    //   })
    // })
    // .catch(err => {
    //   console.log(err)
    // })

    if (fileName.match('.pdf')) {
      window.open(url)
    } else {
      this.setState({preview: true})
      this.setState({previewUrl: url})
    }
  }

  changePreview (event, i) {
    var fileName = this.props.attachments[i]
    var url = `https://storage.cloud.google.com/domatodevs/${fileName}`
    if (fileName.match('.pdf')) {
      window.open(url)
    } else {
      this.setState({previewUrl: url})
    }
  }

  closePreview () {
    this.setState({previewUrl: null})
    this.setState({preview: false})
  }

  render () {
    return (
      <div>
        {/* UPLOADED FILE NAMES */}
        {this.props.fileInfo.map((info, i) => {
          return <div onMouseEnter={(event) => this.thumbnailMouseEnter(event, i)} onMouseLeave={(event) => this.thumbnailMouseLeave(event)} style={{margin: '1px 0 0 0', verticalAlign: 'top', display: 'inline-block', position: 'relative', ':hover': {color: primaryColor}, border: '1px solid black', height: '50px', cursor: 'pointer'}} key={i}>
            <div style={{display: 'inline-block', cursor: 'pointer'}}>
              {info.type === 'application/pdf' &&
              <i className='material-icons' style={{color: primaryColor, fontSize: '50px'}}>picture_as_pdf</i>}
              {info.type !== 'application/pdf' &&
              <i className='material-icons' style={{color: primaryColor, fontSize: '50px'}}>photo</i>}
            </div>
            <div style={{display: 'inline-block', cursor: 'pointer'}}>
              <h4 onClick={(e) => this.openPreview(e, i)} style={{fontSize: '14px', color: 'black', fontWeight: 'bold', position: 'relative', top: '-6px'}}>{info.name}</h4>
              <h4 style={{fontSize: '14px', color: 'black', fontWeight: 'bold'}}>{info.size}</h4>
            </div>
            <i className='material-icons' value={i} onClick={() => this.props.removeUpload(i)} style={{color: primaryColor, cursor: 'pointer', opacity: this.state.hoveringOver === i ? '1.0' : 0}}>clear</i>

            {/* THUMBNAIL ON HOVER */}
            {this.state.thumbnail && this.state.hoveringOver === i &&
              <Thumbnail thumbnailUrl={this.state.thumbnailUrl} />
            }
          </div>
        })}

        {/* UPLOAD ICON IF FILES < 6 */}
        {(this.props.attachments.length <= 5) &&
          <label style={{display: 'inline-block', color: 'black'}}>
            <i style={{color: 'black', margin: '2px 5px 0 0', cursor: 'pointer', fontSize: '30px'}} className='material-icons'>add_circle_outline</i>
            <input type='file' name='file' accept='.jpeg, .jpg, .png, .pdf' onChange={(e) => this.props.handleFileUpload(e)} style={{display: 'none'}} />
          </label>
        }

        {/* MAXED UPLOAD WHEN FILES > 6 */}
        {this.props.attachments.length > 5 &&
          <span style={{color: 'black'}}>Upload maxed</span>
        }

        {/* PREVIEW OVERLAY WITH ITS OWN FILE NAMES */}
        {this.state.preview &&
          <div>
              {!this.state.previewUrl.match('.pdf') &&
              <div>
                <ImagePreview previewUrl={this.state.previewUrl} setBackground={(url) => this.props.setBackground(url)} />
              </div>
              }
            <div style={{position: 'fixed', left: '10%', top: '90%', zIndex: '9999', height: '5%', width: '80%'}}>
              <i className='material-icons' onClick={() => this.closePreview()} style={{color: 'black', cursor: 'pointer'}}>arrow_back</i>

              {this.props.fileInfo.map((info, i) => {
                return (
                  <div key={i} style={{display: 'inline'}}>
                    {info.type === 'application/pdf' &&
                      <i className='material-icons' style={{color: primaryColor}}>picture_as_pdf</i>
                    }
                    {info.type !== 'application/pdf' &&
                      <i className='material-icons' style={{color: primaryColor}}>photo</i>
                    }
                    <span key={i} onClick={(e) => this.changePreview(e, i)} style={{fontSize: '14px', color: primaryColor, fontWeight: 'bold', cursor: 'pointer', position: 'relative', top: '-6px'}}>{info.name} {info.size}</span>
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
