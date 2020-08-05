import React, { forwardRef } from 'react'
import mergeRefs from '../../helpers/mergeRefs'

const noop = () => { }

const Prompt = forwardRef(({
  showPrompt,
  prompt,
  theme,
  text: inputText,
  handleFocus,
  handleKeyDown = noop,
  handleOnChange,
  disabled,
  indent = '  ',
}, promptRef) => {

  const focusTextRef = (el) => {
    if (!el) return

    // resize the text area when more than one line
    el.style.height = `${el.scrollHeight}px`

    if (handleFocus) handleFocus(el)
  }

  const onChange = (e) => {
    if (!handleOnChange) return

    const { value } = e.target
    const unindentedText = value.slice(indent.length)
    handleOnChange(unindentedText)
  }

  return (
    <div className={`prompt ${!showPrompt ? 'hidden' : ''}`}>
      <code
        className="prompt-string"
        style={theme?.prompt}
      >
        {prompt || '>'}
      </code>
      <textarea
        ref={mergeRefs(focusTextRef, promptRef)}
        rows="1"
        className="prompt-input"
        spellCheck="false"
        value={`${indent}${inputText}`}
        onChange={(e) => onChange(e)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={disabled ? 'command' : 'input-prompt'}
        style={theme?.input}
      />
    </div>
  )
})

Prompt.displayName = 'Prompt'

export default Prompt
