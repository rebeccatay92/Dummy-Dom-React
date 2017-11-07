import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { plannerReducer } from './reducers/plannerReducer'
import { bucketReducer } from './reducers/bucketReducer'
import { userReducer } from './reducers/userReducer'

import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo'
import { createHttpLink, HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { ApolloLink, concat} from 'apollo-link'

// const httpLink = new HttpLink({uri: 'http://localhost:3001/graphql'})

// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const token = window.localStorage.getItem('token')
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : null
//     }
//   }
// })

// const authMiddleware = new ApolloLink((operation, forward) => {
//   // add the authorization to the headers
//   operation.setContext({
//     headers: {
//       authorization: 'Bearer 123456778888888888'
//     }
//   })
//   return forward(operation)
// })

// const client = new ApolloClient({
//   link: concat(authMiddleware, httpLink)
// })

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3001/graphql'
})

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJSZW5lX0tvaGxlckBnbWFpbC5jb20iLCJpYXQiOjE1MTAwMjMwNTV9.P0y_jFLlMKBQATAuYVJeZNL-4u_VdDV2rhnfvqrpTJo`
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
