import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import { useUser } from '../auth/UserProvider'
import { hasRoles } from '../auth/helpers'


const useRedirectOnUserState = ({ userExists, role = 'user', destination = '/' }) => {
  const history = useHistory()
  const { userService } = useUser()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function redirectUnauthenticated() {
      const verification = await userService.verifyUser()
      if (shouldRedirect(userExists, role, verification)) {
        history.replace(destination)
      } else {
        setChecking(false)
      }
    }
    redirectUnauthenticated()
  }, [])

  return checking
}

const shouldRedirect = (userExists, role, verification) => {
  if (userExists) {
    return !verification || !hasRoles(verification, role)
  }
  return verification && hasRoles(verification, role)
}

export const useMustHaveUser = () => {
  return useRedirectOnUserState({ userExists: true, role: 'user' })
}

export const useMustNotHaveUser = () => {
  return useRedirectOnUserState({ userExists: false, role: 'user' })
}

export const useMustNotHaveLoggedInUser = () => {
  return useRedirectOnUserState({ userExists: false, role: 'user', destination: '/profile' })
}

export const useMustHaveAdminUser = () => {
  return useRedirectOnUserState({ userExists: true, role: 'admin' })
}
