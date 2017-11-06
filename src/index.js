import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { plannerReducer } from './reducers/plannerReducer'
import { bucketReducer } from './reducers/bucketReducer'
import { userReducer } from './reducers/userReducer'
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo'

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3001/graphql'
})

const client = new ApolloClient({
  networkInterface: networkInterface
})

const store = createStore(combineReducers({
  plannerActivities: plannerReducer,
  bucketList: bucketReducer,
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
