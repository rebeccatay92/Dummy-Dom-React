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
import { cloudStorageReducer } from './reducers/cloudStorageReducer'

import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo'

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

const client = new ApolloClient({
  networkInterface: networkInterface
})

const store = createStore(combineReducers({
  plannerActivities: plannerReducer,
  bucketList: bucketReducer,
  plannerColumns: plannerColumnReducer,
  plannerTimeline: plannerTimelineReducer,
  token: userReducer,
  cloudStorageToken: cloudStorageReducer,
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
