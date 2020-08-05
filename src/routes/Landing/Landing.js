import React from 'react'
import styled from 'styled-components'
import LoginTerminal from '../../components/LoginTerminal/LoginTerminal'
import { useUser } from '../../auth/UserProvider'
import { useMustNotHaveLoggedInUser } from '../../hooks/userRedirects'


const LoggedIn = styled.div`
  position: fixed;
  color: #efdfbf;
  right: calc(12px + 2vmin);
  top: calc(12px + 2vmin);
  font-size: calc(8px + 1vmin);
  visibility: ${props => props.user ? 'visible' : 'hidden'};
`

function Landing() {
  useMustNotHaveLoggedInUser()
  const { user } = useUser()

  return (
    <div>
      <LoggedIn user={user}>{user ? user.name : ''} logged in</LoggedIn>
      <LoginTerminal />
    </div>
  )
}

export default Landing
