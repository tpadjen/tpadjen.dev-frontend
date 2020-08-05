/* eslint-disable react/jsx-fragments */
import React, { useState, useEffect, useRef } from 'react'
import { useObservableState } from 'observable-hooks'
import TerminalController from './TerminalController'
import './Terminal.css'
import InputPrompt from './prompt/InputPrompt'
import ExecutedPrompt from './prompt/ExecutedPrompt'


const Message = ({ text }) => {
  return (
    <pre
      role="status"
    >{text}</pre>
  )
}

const ErrorMessage = ({ text, theme }) => {
  return (
    <pre
      className="error"
      style={theme?.error}
      role="status"
    >{text}</pre>
  )
}

function Terminal({
  controller,
  commands = {},
  theme,
  prompt,
  indent,
  services,
}) {
  const [terminal] = useState(
    controller || new TerminalController({ commands, services, prompt }),
  )
  const events = useObservableState(terminal.currentEvents$, [])

  useEffect(() => {
    terminal.runBuiltInCommand('welcome')
  }, [])

  useEffect(() => {
    terminal.services = services
  }, [services])

  const createOutput = (event) => {
    switch (event.type) {
      case 'output': return <Message text={event.text} />
      case 'error': return <ErrorMessage text={event.text} theme={theme} />
      case 'blank': return <div className="blank" style={theme?.blank} />
      case 'command': return (
        <ExecutedPrompt
          text={event.text}
          theme={theme}
          prompt={prompt}
          indent={indent}
        />
      )
      default: return ''
    }
  }

  const inputPromptRef = useRef()
  const focusInputPrompt = (event) => {
    if (event.target === event.currentTarget) inputPromptRef.current.focus()
  }

  return (
    <div
      className="terminal"
      style={theme?.terminal}
      onClick={focusInputPrompt}
    >
      <div className="output" style={theme?.output}>
        {events && events.map((event) => (
          <code
            key={event.id}
            className="message"
            style={theme?.output}
          >
            {createOutput(event)}
          </code>
        ))}
      </div>
      <InputPrompt
        terminal={terminal}
        theme={theme}
        indent={indent}
        prompt={prompt}
        ref={inputPromptRef}
      />
    </div>
  )
}

export default Terminal
