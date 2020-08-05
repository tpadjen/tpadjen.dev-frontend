import React from 'react'
import { act, render, screen } from '@testing-library/react'
import LoginTerminal from './LoginTerminal'
import { UserContext } from '../../auth/UserProvider'
import { runCommand, getPrompt } from '../Terminal/terminal.test.helpers'
import { Router } from 'react-router-dom'


const renderComponent = ({userService, component, history = mockHistory() }) => {
  render (
    <Router history={history}>
      <UserContext.Provider value={userService}>{component}</UserContext.Provider>
    </Router>
  )
}

const mockHistory = () => ({ push: jest.fn(), location: { }, listen: jest.fn() })

describe('LoginTerminal', () => {

  describe('login', () => {

    it('should log in a user with a valid ticket', async () => {
      const userService = {
        login: jest.fn().mockImplementation(() => ({
          name: 'Bob',
          ticket: 'ticket1',
          token: 'token'
        }))
      }
      const history = mockHistory()
      jest.useFakeTimers()

      renderComponent({
        component: <LoginTerminal />,
        userService,
        history,
      })

      runCommand('login ticket1')

      await screen.findByText('Logging in with code: ticket1...')

      expect(userService.login).toHaveBeenCalledWith('ticket1')

      const loggedin = await screen.findByText(/Welcome Bob/i)
      expect(loggedin).toHaveAttribute('role', 'status')

      await screen.findByText(/Redirecting.../)
      act(() => {
        jest.advanceTimersByTime(1000)
        expect(history.push).toHaveBeenCalledWith('/profile')
      })
    })

    it('should reject a user with an invalid ticket', async () => {
      const userService = {
        login: jest.fn().mockImplementation(() => undefined)
      }
      const history = mockHistory()

      renderComponent({
        component: <LoginTerminal />,
        userService,
        history,
      })

      runCommand('login ticket1')

      const errorMessage = await screen.findByText('Code not found')
      expect(errorMessage).toHaveClass('error')
      expect(errorMessage).toHaveAttribute('role', 'status')
      expect(history.push).not.toHaveBeenCalled()
      expect(await getPrompt()).toBeInTheDocument()
    })

    it('should reject a user if there is an error with login', async () => {
      const originalError = console.error
      console.error = jest.fn()

      const userService = {
        login: jest.fn().mockImplementation(() => { throw new Error('Login Error') })
      }
      const history = mockHistory()

      renderComponent({
        component: <LoginTerminal />,
        userService,
        history,
      })

      runCommand('login ticket1')

      const errorMessage = await screen.findByText('Code not found')
      expect(errorMessage).toHaveClass('error')
      expect(errorMessage).toHaveAttribute('role', 'status')
      expect(history.push).not.toHaveBeenCalled()

      console.error = originalError
    })

    it('should give help if no ticket is provided', async () => {
      renderComponent({
        component: <LoginTerminal />,
        userService: { login: jest.fn() },
      })
      runCommand('login ')

      const helpMessage = await screen.findByText('Please provide an invitation code')
      expect(helpMessage).toHaveAttribute('role', 'status')
      const helpMessage3 = await screen.findByText(/> login your-code/)
      expect(helpMessage3).toHaveAttribute('role', 'status')

      expect(await getPrompt()).toBeInTheDocument()
    })

    it('should log in valid admin', async () => {
      const userService = {
        signInGoogleUser: jest.fn().mockImplementation(() => Promise.resolve({
          name: 'Admin',
          token: 'token'
        }))
      }
      const history = mockHistory()
      jest.useFakeTimers()

      renderComponent({
        component: <LoginTerminal />,
        userService,
        history,
      })

      runCommand('login admin')

      const loggedin = await screen.findByText(/Welcome Admin/i)
      expect(loggedin).toHaveAttribute('role', 'status')
      expect(userService.signInGoogleUser).toHaveBeenCalled()

      await screen.findByText(/Redirecting.../)
      act(() => {
        jest.advanceTimersByTime(1000)
        expect(history.push).toHaveBeenCalledWith('/admin')
      })
    })

    it('should reject an invalid admin', async () => {
      const originalError = console.error
      console.error = jest.fn()

      const userService = {
        signInGoogleUser: jest.fn().mockImplementation(() => Promise.reject('Login Error'))
      }
      const history = mockHistory()

      renderComponent({
        component: <LoginTerminal />,
        userService,
        history,
      })

      runCommand('login admin')

      const errorMessage = await screen.findByText(/Error/)
      expect(errorMessage).toHaveClass('error')
      expect(errorMessage).toHaveAttribute('role', 'status')
      expect(userService.signInGoogleUser).toHaveBeenCalled()
      expect(history.push).not.toHaveBeenCalled()

      await act(async () => {
        expect(await getPrompt()).toBeInTheDocument()

        console.error = originalError
      })
    })

  })

})
