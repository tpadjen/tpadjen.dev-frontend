import React from 'react'
import { useMustHaveUser } from '../hooks/userRedirects'


const withMustHaveUser = (Component) => {
  const WrappedComponent = (props) => {
    const checkingForUser = useMustHaveUser()
    if (checkingForUser) return null

    return <Component {...props} />
  }
  WrappedComponent.displayName = Component.displayName
  return WrappedComponent
}

export default withMustHaveUser
