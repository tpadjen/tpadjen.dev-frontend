import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KeyCodes from './prompt/Keycodes'

export const getPrompt = async () => await screen.getByRole('textbox', { name: /input-prompt/i })

export const runCommand = (command) => {
  getPrompt()
    .then((prompt) => {
      userEvent.type(prompt, `  ${command}`)
      fireEvent.keyDown(prompt, { key: 'Enter', keyCode: KeyCodes.ENTER })
    })
}
