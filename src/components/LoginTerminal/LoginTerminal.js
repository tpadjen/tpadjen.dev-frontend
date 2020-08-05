import React from 'react'
import { terminalCommands } from './terminalCommands'
import { useUser } from '../../auth/UserProvider'
import Terminal from '../Terminal/Terminal'
import { useHistory } from 'react-router-dom'


const LoginTerminal = ({ theme = defaultTheme }) => {
  const history = useHistory()
  const { user, userService} = useUser()

  return (
    <Terminal
      services={{ user: user, userService: userService, history }}
      commands={terminalCommands}
      theme={theme}
      prompt={'>'}
    />
  )
}

const defaultTheme = {
  output: {
    color: '#efdfbf',
  },
  terminal: {
    backgroundColor: '#282c34',
    width: 'calc(100vw - 4vmin)',
    height: 'calc(100vh - 4vmin)',
    padding: '4vmin',
    borderRadius: '0.5vmin',
    fontSize: 'calc(10px + 1vmin)',
    boxShadow: '5px 5px 15px 5px #222',
  },
  prompt: {
    color: '#61dafb',
    fontSize: 'calc(13px + 1vmin)',
  },
  input: {
    caretColor: '#61dafb',
    color: '#61dafb',
  },
  error: {
    color: '#fe312e',
  },
}

export default LoginTerminal
