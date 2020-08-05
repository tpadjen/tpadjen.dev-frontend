import React, { createContext, useContext } from 'react'
import userService from './user.service'


export const useUser = () => {
  const userService = useContext(UserContext)

  return {
    user: userService.user,
    userService
  }
}

export const UserContext = createContext()

const UserProvider = ({children, ...props}) => {
  const service = userService()

  return (
    <UserContext.Provider {...props} value={service} >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
