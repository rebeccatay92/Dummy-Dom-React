export const userReducer = (state = '', action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      var localStorage = window.localStorage.getItem('token')
      return localStorage
    case 'LOGOUT_USER':
      window.localStorage.removeItem('token')
      localStorage = window.localStorage.getItem('token')
      return localStorage
    default:
      return state
  }
}
