import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import { plannerReducer } from './reducers/plannerReducer'
import { bucketReducer } from './reducers/bucketReducer'
import { userReducer } from './reducers/userReducer'
import { plannerColumnReducer } from './reducers/plannerColumnReducer'
import { plannerTimelineReducer } from './reducers/plannerTimelineReducer'

import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo'

// import ApolloProvider from 'react-apollo'
// import ApolloClient from 'apollo-client'
// import { HttpLink } from 'apollo-link-http'
// import { ApolloLink, concat } from 'apollo-link'

import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import introspectionQueryResultData from './fragmentTypes.json'

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3001/graphql'
})

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {
        authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    next()
  }
}])

// const authMiddleware = new ApolloLink((operation, forward) => {
//   // add the authorization to the headers
//   operation.setContext({
//     headers: {
//       authorization: 'Bearer 12345'
//     }
//   })
//
//   return forward(operation)
// })

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionQueryResultData
})

// console.log('introspection', introspectionQueryResultData)
// const cache = new InMemoryCache({ fragmentMatcher })

const client = new ApolloClient({
  networkInterface: networkInterface
  // fragmentMatcher: fragmentMatcher,
  // addTypeName: true
})

const store = createStore(combineReducers({
  plannerActivities: plannerReducer,
  bucketList: bucketReducer,
  plannerColumns: plannerColumnReducer,
  plannerTimeline: plannerTimelineReducer,
  token: userReducer,
  apollo: client.reducer()
}),
{},
compose(applyMiddleware(client.middleware()))
)

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <App />
  </ApolloProvider>
  , document.getElementById('root'))
registerServiceWorker()
