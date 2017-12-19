import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Radium from 'radium'
import moment from 'moment'

import { createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, foodTypeStyle, foodTypeContainerStyle, eventDescContainerStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle } from '../../Styles/styles'

import LocationSelection from '../location/LocationSelection'
import DateTimePicker from '../eventFormComponents/DateTimePicker'
import BookingDetails from '../eventFormComponents/BookingDetails'
import LocationAlias from '../eventFormComponents/LocationAlias'
import Notes from '../eventFormComponents/Notes'
import Attachments from '../eventFormComponents/Attachments'
import SubmitCancelForm from '../eventFormComponents/SubmitCancelForm'

import { createFood } from '../../apollo/food'
import { queryItinerary } from '../../apollo/itinerary'

import retrieveToken from '../../helpers/cloudstorage'
import countriesToCurrencyList from '../../helpers/countriesToCurrencyList'
class CreateLodgingForm extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <div />
    )
  }
}

export default CreateLodgingForm
