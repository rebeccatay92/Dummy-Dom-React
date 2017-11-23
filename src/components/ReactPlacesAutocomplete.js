import React, {Component} from 'react'

class ReactPlacesAutocomplete extends Component {
  constructor (props) {
    super(props)
    let timeout
    this.state = {
      search: ''
    }
  }

  handleChange (e) {
    this.setState({search: e.target.value})
  }

  customDebounce () {
    var queryStr = this.state.search
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.autocomplete(queryStr)
    }, 250)
  }

  autocomplete () {
    var service = new window.google.maps.places.AutocompleteService()
    service.getPlacePredictions({input: this.state.search}, function (predictions, status) {
      console.log(predictions, status)
    })
  }

  render() {
    return (
      <div>
        <input onChange={(e) => this.handleChange(e)} onKeyDown={() => this.customDebounce()} />
      </div>
    )
  }
}
export default ReactPlacesAutocomplete
