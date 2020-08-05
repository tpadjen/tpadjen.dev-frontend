import React from 'react'
import {
  // BrowserRouter as Router,
  Route,
  // Switch,
  Redirect,
} from 'react-router-dom'

const withGuardedRoute = (guard) => {
  const UserRoute = ({ component: Component, ...rest }) => {
    return (
      <Route {...rest} render={(props) => (
        guard
          ? <Component {...props} />
          : <Redirect to='/' />
      )} />
    )
  }
  return UserRoute
}

export default withGuardedRoute
