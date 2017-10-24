import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
// import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { plannerReducer } from './reducers/plannerReducer'
import { bucketReducer } from './reducers/bucketReducer'
import { itineraryReducer } from './reducers/itineraryReducer'
import { ApolloClient, ApolloProvider } from 'react-apollo'

const client = new ApolloClient()

const store = createStore(combineReducers({
  plannerActivities: plannerReducer,
  bucketList: bucketReducer,
  itineraryList: itineraryReducer,
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
