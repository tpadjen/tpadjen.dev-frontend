import React from 'react'
import Prompt from './Prompt'

function ExecutedPrompt({
  text,
  prompt,
  theme,
}) {
  return (
    <Prompt
      showPrompt
      prompt={prompt}
      theme={theme}
      text={text}
      disabled
    />
  )
}

export default ExecutedPrompt
