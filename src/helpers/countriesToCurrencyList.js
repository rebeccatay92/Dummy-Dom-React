var countries = require('country-data').countries

function countriesToCurrencyList (countriesArr) {
  var currencyList = []
  countriesArr.forEach(e => {
    var currencyCode = countries[e.code].currencies[0]
    if (!currencyList.includes(currencyCode)) {
      currencyList.push(currencyCode)
    }
  })
  return currencyList
}

export default countriesToCurrencyList
