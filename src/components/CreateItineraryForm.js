import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createItinerary } from '../actions/itineraryActions'

class CreateItineraryForm extends Component {
  constructor () {
    super()
    this.state = {
      name: '',
      countryId: null,
      startDate: null,
      endDate: null,
      pax: null,
      travelInsurance: '',
      budget: null
    }
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
    console.log(this.state.countryId)
  }

  render () {
    return (
      <div>
        <h3>Create Itinerary Form</h3>
        <form>
          <label>
            Country
            <select name='countryId' value={this.state.countryId} onChange={(e) => this.handleChange(e, 'countryId')}>
              <option value='AF'>Afghanistan</option>
              <option value='AX'>Åland Islands</option>
              <option value='AL'>Albania</option>
              <option value='DZ'>Algeria</option>
              <option value='AS'>American Samoa</option>
              <option value='AD'>Andorra</option>
              <option value='AO'>Angola</option>
              <option value='AI'>Anguilla</option>
              <option value='AQ'>Antarctica</option>
              <option value='AG'>Antigua and Barbuda</option>
              <option value='AR'>Argentina</option>
              <option value='AM'>Armenia</option>
              <option value='AW'>Aruba</option>
              <option value='AU'>Australia</option>
              <option value='AT'>Austria</option>
              <option value='AZ'>Azerbaijan</option>
              <option value='BS'>Bahamas</option>
              <option value='BH'>Bahrain</option>
              <option value='BD'>Bangladesh</option>
              <option value='BB'>Barbados</option>
              <option value='BY'>Belarus</option>
              <option value='BE'>Belgium</option>
              <option value='BZ'>Belize</option>
              <option value='BJ'>Benin</option>
              <option value='BM'>Bermuda</option>
              <option value='BT'>Bhutan</option>
              <option value='BO'>Bolivia</option>
              <option value='BQ'>Bonaire, Sint Eustatius and Saba</option>
              <option value='BA'>Bosnia and Herzegovina</option>
              <option value='BW'>Botswana</option>
              <option value='BV'>Bouvet Island</option>
              <option value='BR'>Brazil</option>
              <option value='IO'>British Indian Ocean Territory</option>
              <option value='BN'>Brunei Darussalam</option>
              <option value='BG'>Bulgaria</option>
              <option value='BF'>Burkina Faso</option>
              <option value='BI'>Burundi</option>
              <option value='KH'>Cambodia</option>
              <option value='CM'>Cameroon</option>
              <option value='CA'>Canada</option>
              <option value='CV'>Cape Verde</option>
              <option value='KY'>Cayman Islands</option>
              <option value='CF'>Central African Republic</option>
              <option value='TD'>Chad</option>
              <option value='CL'>Chile</option>
              <option value='CN'>China</option>
              <option value='CX'>Christmas Island</option>
              <option value='CC'>Cocos (Keeling) Islands</option>
              <option value='CO'>Colombia</option>
              <option value='KM'>Comoros</option>
              <option value='CG'>Congo</option>
              <option value='CD'>Congo, the Democratic Republic of the</option>
              <option value='CK'>Cook Islands</option>
              <option value='CR'>Costa Rica</option>
              <option value='CI'>Côte d'Ivoire</option>
              <option value='HR'>Croatia</option>
              <option value='CU'>Cuba</option>
              <option value='CW'>Curaçao</option>
              <option value='CY'>Cyprus</option>
              <option value='CZ'>Czech Republic</option>
              <option value='DK'>Denmark</option>
              <option value='DJ'>Djibouti</option>
              <option value='DM'>Dominica</option>
              <option value='DO'>Dominican Republic</option>
              <option value='EC'>Ecuador</option>
              <option value='EG'>Egypt</option>
              <option value='SV'>El Salvador</option>
              <option value='GQ'>Equatorial Guinea</option>
              <option value='ER'>Eritrea</option>
              <option value='EE'>Estonia</option>
              <option value='ET'>Ethiopia</option>
              <option value='FK'>Falkland Islands (Malvinas)</option>
              <option value='FO'>Faroe Islands</option>
              <option value='FJ'>Fiji</option>
              <option value='FI'>Finland</option>
              <option value='FR'>France</option>
              <option value='GF'>French Guiana</option>
              <option value='PF'>French Polynesia</option>
              <option value='TF'>French Southern Territories</option>
              <option value='GA'>Gabon</option>
              <option value='GM'>Gambia</option>
              <option value='GE'>Georgia</option>
              <option value='DE'>Germany</option>
              <option value='GH'>Ghana</option>
              <option value='NI'>Nicaragua</option>
              <option value='NE'>Niger</option>
              <option value='NG'>Nigeria</option>
              <option value='NU'>Niue</option>
              <option value='NF'>Norfolk Island</option>
              <option value='MP'>Northern Mariana Islands</option>
              <option value='NO'>Norway</option>
              <option value='OM'>Oman</option>
              <option value='PK'>Pakistan</option>
              <option value='PW'>Palau</option>
              <option value='PS'>Palestinian Territory</option>
              <option value='PA'>Panama</option>
              <option value='PG'>Papua New Guinea</option>
              <option value='PY'>Paraguay</option>
              <option value='PE'>Peru</option>
              <option value='PH'>Philippines</option>
              <option value='PN'>Pitcairn</option>
              <option value='PL'>Poland</option>
              <option value='PT'>Portugal</option>
              <option value='PR'>Puerto Rico</option>
              <option value='QA'>Qatar</option>
              <option value='RE'>Réunion</option>
              <option value='RO'>Romania</option>
              <option value='RU'>Russian Federation</option>
              <option value='RW'>Rwanda</option>
              <option value='BL'>Saint Barthélemy</option>
              <option value='SH'>Saint Helena, Ascension and Tristan da Cunha</option>
              <option value='KN'>Saint Kitts and Nevis</option>
              <option value='LC'>Saint Lucia</option>
              <option value='MF'>Saint Martin (French part)</option>
              <option value='PM'>Saint Pierre and Miquelon</option>
              <option value='VC'>Saint Vincent and the Grenadines</option>
              <option value='WS'>Samoa</option>
              <option value='SM'>San Marino</option>
              <option value='ST'>Sao Tome and Principe</option>
              <option value='SA'>Saudi Arabia</option>
              <option value='SN'>Senegal</option>
              <option value='RS'>Serbia</option>
              <option value='SC'>Seychelles</option>
              <option value='SL'>Sierra Leone</option>
              <option value='SG'>Singapore</option>
              <option value='SX'>Sint Maarten (Dutch part)</option>
              <option value='SK'>Slovakia</option>
              <option value='SI'>Slovenia</option>
              <option value='SB'>Solomon Islands</option>
              <option value='SO'>Somalia</option>
              <option value='ZA'>South Africa</option>
              <option value='GS'>South Georgia and the South Sandwich Islands</option>
              <option value='SS'>South Sudan</option>
              <option value='ES'>Spain</option>
              <option value='LK'>Sri Lanka</option>
              <option value='SD'>Sudan</option>
              <option value='SR'>Suriname</option>
              <option value='SJ'>Svalbard and Jan Mayen</option>
              <option value='SZ'>Swaziland</option>
              <option value='SE'>Sweden</option>
              <option value='CH'>Switzerland</option>
              <option value='SY'>Syria</option>
              <option value='TW'>Taiwan</option>
              <option value='TJ'>Tajikistan</option>
              <option value='TZ'>Tanzania</option>
              <option value='TH'>Thailand</option>
              <option value='TL'>Timor-Leste</option>
              <option value='TG'>Togo</option>
              <option value='TK'>Tokelau</option>
              <option value='TO'>Tonga</option>
              <option value='TT'>Trinidad and Tobago</option>
              <option value='TN'>Tunisia</option>
              <option value='TR'>Turkey</option>
              <option value='TM'>Turkmenistan</option>
              <option value='TC'>Turks and Caicos Islands</option>
              <option value='TV'>Tuvalu</option>
              <option value='UG'>Uganda</option>
              <option value='UA'>Ukraine</option>
              <option value='AE'>United Arab Emirates</option>
              <option value='GB'>United Kingdom</option>
              <option value='US'>United States</option>
              <option value='UM'>United States Minor Outlying Islands</option>
              <option value='UY'>Uruguay</option>
              <option value='UZ'>Uzbekistan</option>
              <option value='VU'>Vanuatu</option>
              <option value='VE'>Venezuela</option>
              <option value='VN'>Viet Nam</option>
              <option value='VG'>Virgin Islands, British</option>
              <option value='VI'>Virgin Islands, U.S.</option>
              <option value='WF'>Wallis and Futuna</option>
              <option value='EH'>Western Sahara</option>
              <option value='YE'>Yemen</option>
              <option value='ZM'>Zambia</option>
              <option value='ZW'>Zimbabwe</option>
            </select>
          </label>
          <label>
            Name of this itinerary
            <input type='text' name='name' onChange={(e) => this.handleChange(e, 'name')} />
          </label>
          <label>
            Start Date
            <input type='date' name='startDate' onChange={(e) => this.handleChange(e, 'startDate')} />
          </label>
          <label>
            End Date
            <input type='date' name='endDate' onChange={(e) => this.handleChange(e, 'endDate')} />
          </label>
          <label>
            Pax
            <input type='number' name='pax' onChange={(e) => this.handleChange(e, 'pax')} />
          </label>
          <label>
            Travel Insurance
            <input type='text' name='travelInsurance' onChange={(e) => this.handleChange(e, 'travelInsurance')} />
          </label>
          <label>
            Budget
            <input type='number' name='budget' onChange={(e) => this.handleChange(e, 'budget')} />
          </label>
        </form>
        <button onClick={() => this.props.createItinerary(this.state)}>Add fake itinerary</button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createItinerary: (form) => {
      console.log('textarea', form.name)
      var newItinerary = {
        id: 555,
        countryId: form.countryId,
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
        pax: form.pax,
        travelInsurance: form.travelInsurance,
        budget: form.budget
      }
      dispatch(createItinerary(newItinerary))
    }
  }
}

export default connect(null, mapDispatchToProps)(CreateItineraryForm)
