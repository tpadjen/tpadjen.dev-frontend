import React, { useState, useEffect, forwardRef } from 'react'
import KeyCodes from './Keycodes'
import Prompt from './Prompt'

const InputPrompt = forwardRef(({
  terminal,
  theme,
  prompt = '$',
  indent,
}, inputPromptRef) => {
  const [text, setText] = useState('')
  const [showPrompt, setShowPrompt] = useState(terminal.isReady$$.value)

  useEffect(() => {
    const sub = terminal.currentHistoryCommand$.subscribe((current) => {
      setText(current ? current.text : '')
    })

    return () => sub.unsubscribe()
  }, [terminal])

  useEffect(() => {
    const sub = terminal.isReady$.subscribe((isReady) => setShowPrompt(isReady))

    return () => sub.unsubscribe()
  }, [terminal])

  const handleOnChange = (newText) => setText(newText)

  const handleKeyDown = (event) => {
    const { target: { value }, keyCode } = event
    switch (keyCode) {
      case KeyCodes.ENTER:
        event.preventDefault()
        execute(value)
        break
      case KeyCodes.UP:
        event.preventDefault()
        terminal.decrementHistoryPosition()
        break
      case KeyCodes.DOWN:
        event.preventDefault()
        terminal.incrementHistoryPosition()
        break
      default:
        break
    }
  }

  const handleFocus = (el) => {
    // focus the cursor at the end of the text on load so indent works
    el.focus()
    if (el.selectionStart < 2) el.selectionStart = 2
    if (el.selectionEnd < 2) el.selectionEnd = 2
  }

  const execute = (currentText) => {
    const commandToExecute = currentText.trim()
    if (commandToExecute.length > 0) {
      terminal.executeCommand(currentText.trim())
      setText('')
    }
  }

  return (
    <Prompt
      showPrompt={showPrompt}
      prompt={prompt}
      theme={theme}
      text={text}
      handleFocus={handleFocus}
      handleKeyDown={handleKeyDown}
      handleOnChange={handleOnChange}
      disabled={false}
      indent={indent}
      ref={inputPromptRef}
    />
  )
})

InputPrompt.displayName = 'InputPrompt'

export default InputPrompt
