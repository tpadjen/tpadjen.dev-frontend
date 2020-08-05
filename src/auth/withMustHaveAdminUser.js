import React from 'react'
import { useMustHaveAdminUser } from '../hooks/userRedirects'


const withMustHaveAdminUser = (Component) => {
  const WrappedComponent = (props) => {
    const checkingForAdmin = useMustHaveAdminUser()
    if (checkingForAdmin) return null

    return <Component {...props} />
  }
  WrappedComponent.displayName = Component.displayName
  return WrappedComponent
}

export default withMustHaveAdminUser
