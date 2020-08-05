import React from 'react'
import { render, screen } from '@testing-library/react'
import UserProvider from './auth/UserProvider'
import App from './App'


const mockUserService = {}

const renderApp = ({ userService, ...rest} ) => {
  return render (
    <UserProvider value={userService} >
      <App {...rest} />
    </UserProvider>
  )
}

test('renders a greeting', async () => {
  renderApp({ userService: mockUserService })

  const greeting = await screen.findByText(/Welcome to tpadjen\.dev/i)
  expect(greeting).toBeInTheDocument()
})
