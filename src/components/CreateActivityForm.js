import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Radium, { Style } from 'radium'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import { FormGroup, InputGroup } from 'react-bootstrap'

import LocationSelection from './LocationSelection'
import ImagePreview from './ImagePreview'
import Thumbnail from './Thumbnail'
import PlannerDatePicker from './PlannerDatePicker'

import { queryItinerary } from '../apollo/itinerary'
import { createActivity } from '../apollo/activity'

const jwt = require('jsonwebtoken')
var countries = require('country-data').countries

const PDFJS = require('pdfjs-dist')

class CreateActivityForm extends Component {
  constructor (props) {
    super(props)
    let apiToken
    this.state = {
      ItineraryId: this.props.ItineraryId,
      dates: this.props.dates.map(e => {
        return moment(e).unix()
      }),
      date: (new Date(this.props.date)).toISOString().substring(0, 10),
      startDay: this.props.day,
      endDay: this.props.day,
      startDate: moment(new Date(this.props.date)),
      endDate: moment(new Date(this.props.date)),
      googlePlaceData: {},
      name: '',
      notes: '',
      startTime: '', // should be Int
      endTime: '', // should be Int
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      fileNames: [],
      attachments: [],
      thumbnail: false,
      thumbnailUrl: null,
      offset: null,
      preview: false,
      previewUrl: null,
      backgroundImage: './Activity_Background.jpg'
    }
  }

  handleChange (e, field) {
    if (field !== 'startDate' && field !== 'endDate') {
      this.setState({
        [field]: e.target.value
      })
    }

    if (field === 'startDay' || field === 'endDay') {
      var newUnix = this.state.dates[e.target.value - 1]
      var newDate = moment.unix(newUnix)

      if (field === 'startDay') {
        this.setState({startDate: newDate})
        if (e.target.value > this.state.endDay) {
          this.setState({endDay: e.target.value})
          this.setState({endDate: newDate})
        }
      }
      if (field === 'endDay') {
        this.setState({endDate: newDate})
      }
    }

    if (field === 'startDate' || field === 'endDate') {
      // set the new start/end date
      this.setState({
        [field]: moment(e._d)
      })

      var selectedUnix = moment(e._d).unix()
      var newDay = this.state.dates.indexOf(selectedUnix) + 1

      if (field === 'startDate') {
        this.setState({startDay: newDay})
        if (selectedUnix > this.state.endDate.unix()) {
          this.setState({endDate: moment(e._d)})
          this.setState({endDay: newDay})
        }
      } else if (field === 'endDate') {
        this.setState({endDay: newDay})
      }
    }
  }

  handleSubmit () {
    // time is relative to 1970 1st jan
    var startTimeStr = this.state.startTime
    var endTimeStr = this.state.endTime

    if (startTimeStr) {
      var startHours = startTimeStr.split(':')[0]
      var startMins = startTimeStr.split(':')[1]
      var startUnix = (startHours * 60 * 60) + (startMins * 60)
    }
    if (endTimeStr) {
      if (endTimeStr === '00:00') {
        endTimeStr = '24:00'
      }
      var endHours = endTimeStr.split(':')[0]
      var endMins = endTimeStr.split(':')[1]
      var endUnix = (endHours * 60 * 60) + (endMins * 60)
    }

    var bookingStatus = this.state.bookingConfirmation ? true : false

    var newActivity = {
      ItineraryId: parseInt(this.state.ItineraryId),
      startDay: typeof (this.state.startDay) === 'number' ? this.state.startDay : parseInt(this.state.startDay),
      endDay: typeof (this.state.endDay) === 'number' ? this.state.endDay : parseInt(this.state.endDay),
      loadSequence: this.props.highestLoadSequence + 1,
      name: this.state.name,
      currency: this.state.currency,
      cost: parseInt(this.state.cost),
      bookingStatus: bookingStatus,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      notes: this.state.notes,
      attachments: this.state.attachments
    }
    if (startUnix) newActivity.startTime = startUnix
    if (endUnix) newActivity.endTime = endUnix
    if (this.state.googlePlaceData.placeId) newActivity.googlePlaceData = this.state.googlePlaceData
    console.log('newActivity', newActivity)

    this.props.createActivity({
      variables: newActivity,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    })

    this.resetState()
    this.props.toggleCreateActivityForm()
  }

  closeCreateActivity () {
    this.state.attachments.forEach(uri => {
      uri = uri.replace('/', '%2F')
      var uriBase = 'https://www.googleapis.com/storage/v1/b/domatodevs/o/'
      var uriFull = uriBase + uri

      fetch(uriFull, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      })
      .then(response => {
        console.log(response)
        if (response.status === 204) {
          console.log('delete from cloud storage succeeded')
        }
      })
      .catch(err => console.log(err))
    })
    this.resetState()
    this.props.toggleCreateActivityForm()
  }

  resetState () {
    this.setState({
      startDay: this.props.startDay,
      endDay: this.props.endDay,
      startDate: (new Date(this.props.date)).toISOString().substring(0, 10),
      endDate: (new Date(this.props.date)).toISOString().substring(0, 10),
      googlePlaceData: {},
      name: '',
      notes: '',
      startTime: '', // should be Int
      endTime: '', // should be Int
      cost: 0,
      currency: this.state.currencyList[0],
      bookingStatus: false,
      bookedThrough: '',
      bookingConfirmation: '',
      fileNames: [],
      attachments: [],
      thumbnail: false,
      thumbnailUrl: null,
      offset: null,
      preview: false,
      previewUrl: null,
      backgroundImage: ''
    })
    this.apiToken = null
  }

  selectLocation (location) {
    this.setState({googlePlaceData: location})
  }

  handleFileUpload (e) {
    e.preventDefault()
    var file = e.target.files[0]
    console.log('file', file)
    if (file) {
      var ItineraryId = this.state.ItineraryId
      var timestamp = Date.now()
      var uriBase = ' https://www.googleapis.com/upload/storage/v1/b/domatodevs/o?uploadType=media&name='
      var uriFull = `${uriBase}Itinerary${ItineraryId}/${file.name}_${timestamp}`
      fetch(uriFull,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': file.type,
            'Content-Length': file.size
          },
          body: file
        }
      )
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => {
        console.log('json', json)
        this.setState({attachments: this.state.attachments.concat([json.name])})
        this.setState({fileNames: this.state.fileNames.concat([file.name])})
      })
      .catch(err => {
        console.log('err', err)
      })
    }
  }

  removeUpload (index) {
    var objectName = this.state.attachments[index]
    objectName = objectName.replace('/', '%2F')
    var uriBase = 'https://www.googleapis.com/storage/v1/b/domatodevs/o/'
    var uriFull = uriBase + objectName

    fetch(uriFull, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`
      }
    })
    .then(response => {
      console.log(response)
      if (response.status === 204) {
        console.log('delete from cloud storage succeeded')
      }
    })
    .then(() => {
      var attach = this.state.attachments
      var files = this.state.fileNames
      var newAttachmentsArr = (attach.slice(0, index)).concat(attach.slice(index + 1))
      var newFilesArr = (files.slice(0, index)).concat(files.slice(index + 1))

      this.setState({attachments: newAttachmentsArr})
      this.setState({fileNames: newFilesArr})
      this.setState({thumbnail: false})
      this.setState({thumbnailUrl: null})
      this.setState({hoveringOver: null})
    })
    .catch(err => {
      console.log(err)
    })
  }

  thumbnailMouseEnter (event, i) {
    var fileName = this.state.attachments[i]
    var offset = `${100 * i}px` // need to check element position
    this.setState({offset: offset})
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
    var fileName = this.state.attachments[i]
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
    console.log('change preview to', this.state.attachments[i])
    var fileName = this.state.attachments[i]
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

  setBackground (previewUrl) {
    console.log(previewUrl)
    previewUrl = previewUrl.replace(/ /gi, '%20')
    this.setState({backgroundImage: `${previewUrl}`})
  }

  componentDidMount () {
    var currencyList = []
    this.props.countries.forEach(e => {
      var currencyCode = countries[e.code].currencies[0]
      if (!currencyList.includes(currencyCode)) {
        currencyList.push(currencyCode)
      }
    })
    this.setState({currencyList: currencyList})
    this.setState({currency: currencyList[0]})

    // start api token generation
    var payload = {
      'iss': 'domatodevs@neon-rex-186905.iam.gserviceaccount.com',
      'scope': 'https://www.googleapis.com/auth/cloud-platform',
      'aud': 'https://www.googleapis.com/oauth2/v4/token',
      'exp': (Date.now() / 1000) + 3600,
      'iat': Date.now() / 1000
    }

    var token = jwt.sign(payload, process.env.REACT_APP_OAUTH_PRIVATE_KEY, {algorithm: 'RS256'})

    var dataString = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${token}`

    // using jwt to fetch api token from oauth endpoint
    fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: dataString
    })
    .then(response => {
      return response.json()
    })
    .then(json => {
      this.apiToken = json.access_token
      // console.log(json.access_token)
    })
    .catch(err => {
      console.log(err)
    })
  }

  render () {
    return (
      <div style={{backgroundColor: 'transparent', position: 'fixed', left: 'calc(50% - 414px)', top: 'calc(50% - 283px)', width: '828px', height: '567px', zIndex: 999, color: 'white'}}>
        <div style={{boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)', height: '90%'}}>
          <img src={this.state.backgroundImage} style={{maxHeight: '510px', position: 'fixed', opacity: '0.75'}} />
          <div style={{width: '335px', height: '100%', display: 'inline-block', verticalAlign: 'top'}}>
            <LocationSelection selectLocation={location => this.selectLocation(location)} />
            <input placeholder='Input Activity' type='text' name='name' value={this.state.name} onChange={(e) => this.handleChange(e, 'name')} autoComplete='off' style={{background: 'inherit', outline: 'none', border: 'none', textAlign: 'center', fontSize: '16px', fontWeight: '300', width: '335px', ':hover': { outline: '0.3px solid white' }}} />
            {/*
              <h5>Location: {this.state.googlePlaceData.name}</h5>
              <h5>Address: {this.state.googlePlaceData.address}</h5> */}
              <div style={{width: '238px', margin: '45px auto 0 auto', textAlign: 'center', border: '0.3px solid white', height: '131px'}}>
                <div className='planner-date-picker'>
                  <select key={12345} name='startDay' onChange={(e) => this.handleChange(e, 'startDay')} value={this.state.startDay} style={{background: 'inherit', border: 'none', outline: 'none', fontSize: '24px', fontWeight: 100, margin: '10px 5px 10px 0px', ':hover': { outline: '0.3px solid white' }}}>
                    {this.state.dates.map((indiv, i) => {
                      return <option style={{background: '#6D6A7A'}} value={i + 1} key={i}>Day {i + 1}</option>
                    })}
                  </select>
                  <DatePicker customInput={<PlannerDatePicker />} selected={this.state.startDate} dateFormat={'ddd DD MMM YYYY'} minDate={moment.unix(this.state.dates[0])} maxDate={moment.unix(this.state.dates[this.state.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'startDate')} />
                </div>
                <div className='planner-time-picker'>
                  <input style={{background: 'inherit', fontSize: '16px', outline: 'none', border: 'none', textAlign: 'center'}} type='time' name='startTime' value={this.state.startTime} onChange={(e) => this.handleChange(e, 'startTime')} /> <span>to</span>
                  <input style={{background: 'inherit', fontSize: '16px', outline: 'none', border: 'none', textAlign: 'center'}} type='time' name='endTime' value={this.state.endTime} onChange={(e) => this.handleChange(e, 'endTime')} />
                </div>
                <div className='planner-date-picker'>
                  <select key={12346} name='endDay' onChange={(e) => this.handleChange(e, 'endDay')} value={this.state.endDay} style={{background: 'inherit', border: 'none', outline: 'none', fontSize: '24px', fontWeight: 100, margin: '10px 5px 10px 0px', ':hover': { outline: '0.3px solid white' }}}>
                    {this.state.dates.map((indiv, i) => {
                      if (i + 1 >= this.state.startDay) {
                        return <option style={{background: '#6D6A7A'}} value={i + 1} key={i}>Day {i + 1}</option>
                      }
                    })}
                  </select>
                  <DatePicker customInput={<PlannerDatePicker />} selected={this.state.endDate} dateFormat={'ddd DD MMM YYYY'} minDate={this.state.startDate} maxDate={moment.unix(this.state.dates[this.state.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'endDate')} />
                </div>
              </div>
            </div>
            <div style={{width: '493px', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative', color: '#3c3a44'}}>
              <div style={{width: '100%', height: '100%', background: 'white', padding: '65px 2% 2% 77px'}}>
                <div style={{position: 'absolute', top: '20px', right: '20px', color: '#9FACBC'}}>
                  <i onClick={() => this.handleSubmit()} className='material-icons' style={{marginRight: '5px', cursor: 'pointer'}}>done</i>
                  <i onClick={() => this.closeCreateActivity()} className='material-icons' style={{cursor: 'pointer'}}>clear</i>
                </div>
                <h4 style={{fontSize: '24px'}}>Booking Details</h4>
                <label style={{fontSize: '13px', display: 'block', margin: '0', lineHeight: '26px'}}>
                  Service
                </label>
                <input style={{width: '80%'}} type='text' name='bookedThrough' value={this.state.bookedThrough} onChange={(e) => this.handleChange(e, 'bookedThrough')} />
                <label style={{fontSize: '13px', display: 'block', margin: '0', lineHeight: '26px'}}>
                  Confirmation Number
                </label>
                <input style={{width: '80%'}} type='text' name='bookingConfirmation' value={this.state.bookingConfirmation} onChange={(e) => this.handleChange(e, 'bookingConfirmation')} />
                <label style={{fontSize: '13px', display: 'block', margin: '0', lineHeight: '26px'}}>
                  Amount:
                </label>
                <select style={{height: '25px', borderRight: '0', background: 'white', width: '20%'}} name='currency' value={this.state.currency} onChange={(e) => this.handleChange(e, 'currency')}>
                  {this.state.currencyList.map((e, i) => {
                    return <option key={i}>{e}</option>
                  })}
                </select>
                <input style={{width: '60%'}} type='number' name='cost' value={this.state.cost} onChange={(e) => this.handleChange(e, 'cost')} />
                <h4 style={{fontSize: '24px'}}>
                  Additional Notes
                </h4>
                <textarea type='text' name='notes' value={this.state.notes} onChange={(e) => this.handleChange(e, 'notes')} style={{width: '200px', height: '100px', display: 'block'}} />
                <div>
                  {/* <button onClick={() => this.handleSubmit()}>Create New Activity</button>
                  <button onClick={() => this.closeCreateActivity()}>Cancel</button> */}
                </div>
              </div>
            </div>
        </div>
        <div style={{minWidth: '20%', background: 'transparent', marginLeft: '20px', display: 'inline-block'}}>
          <div>
            {(this.state.attachments.length <= 4) &&
              <label style={{display: 'inline-block', color: 'black'}}>
                <i style={{color: '#EDB5BF', margin: '2px 5px 0 0', cursor: 'pointer'}} className='material-icons'>add_circle_outline</i>
                <input type='file' name='file' accept='.jpeg, .jpg, .png, .pdf' onChange={(e) => this.handleFileUpload(e)} style={{display: 'none'}} />
              </label>
            }
            {this.state.attachments.length > 4 &&
              <span style={{color: 'black'}}>Upload maxed</span>
            }
            {this.state.fileNames.map((name, i) => {
              return <div onMouseEnter={(event) => this.thumbnailMouseEnter(event, i)} onMouseLeave={(event) => this.thumbnailMouseLeave(event)} style={{margin: '1px 0 0 0', verticalAlign: 'top', display: 'inline-block', ':hover': {color: '#EDB5BF'}}} key={i}>
                <i className='material-icons' style={{color: '#EDB5BF'}}>folder</i>
                <span onClick={(e) => this.openPreview(e, i)} style={{fontSize: '14px', color: '#EDB5BF', fontWeight: 'bold', cursor: 'pointer', position: 'relative', top: '-6px'}}>{name}</span>
                <i className='material-icons' value={i} onClick={() => this.removeUpload(i)} style={{color: '#EDB5BF', opacity: this.state.hoveringOver === i ? '1.0' : 0}}>clear</i>
              </div>
            })}
            {this.state.thumbnail &&
              <Thumbnail thumbnailUrl={this.state.thumbnailUrl} offset={this.state.offset} />
            }
            {this.state.preview &&
              <div>
                  {!this.state.previewUrl.match('.pdf') &&
                  <div>
                    <ImagePreview previewUrl={this.state.previewUrl} setBackground={(url) => this.setBackground(url)} />
                  </div>
                  }
                <div style={{position: 'fixed', left: '10%', top: '90%', zIndex: '9999', height: '5%', width: '80%'}}>
                  <button onClick={() => this.closePreview()} style={{color: 'black'}}>Close Preview</button>
                  {this.state.fileNames.map((name, i) => {
                    return <span key={i} onClick={(e) => this.changePreview(e, i)} style={{margin: '0 20px 0 20px', color: 'black'}}>{name}</span>
                  })}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default graphql(createActivity, {name: 'createActivity'})(Radium(CreateActivityForm))
