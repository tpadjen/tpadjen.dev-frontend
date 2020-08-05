import React from 'react'
import styled from 'styled-components'
import { Colors } from '../theme'


const UserPage = React.forwardRef(({ children, ...rest }, ref) => {
  return (
    <StyledUserPage {...rest} ref={ref}>{children}</StyledUserPage >
  )
})

UserPage.displayName = 'UserPage'

const StyledUserPage  = styled.div`
  background-color: ${Colors.terminal};

  h1 {
    text-align: center;
    margin-bottom: 1em;
  }
`

export default UserPage
