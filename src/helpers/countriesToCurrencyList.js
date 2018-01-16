var countries = require('country-data').countries
var currencies = require('country-data').currencies

export function countriesToCurrencyList (countriesArr) {
  var currencyList = []
  countriesArr.forEach(e => {
    var currencyCode = countries[e.code].currencies[0]
    if (!currencyList.includes(currencyCode)) {
      currencyList.push(currencyCode)
    }
  })
  return currencyList
}

export function allCurrenciesList () {
  var currencyList= []
  // console.log('currencies', currencies)
  var allCurrenciesArr = currencies.all

  allCurrenciesArr.forEach(e => {
    if (!currencyList.includes(e.code)) {
      currencyList.push(e.code)
    }
  })
  // console.log('list', currencyList)
  return currencyList
}
