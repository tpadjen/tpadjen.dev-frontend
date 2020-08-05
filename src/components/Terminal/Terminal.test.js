import React from 'react'
import { render, screen, wait } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Terminal from './Terminal'
import { getPrompt, runCommand } from './terminal.test.helpers'


describe('Terminal', () => {

  describe('greeting', () => {
    it('has a greeting', () => {
      render(<Terminal />)
      expect(screen.getByText('Hello')).toBeInTheDocument()
    })
  })

  describe('prompt string', () => {
    it('has a default prompt string of `$`', () => {
      const { container } = render(<Terminal />)
      const promptString = container.querySelector('.prompt-string')
      expect(promptString.innerHTML).toBe('$')
    })

    it('prompt string can be changed', () => {
      const { container } = render(<Terminal prompt="=>" />)
      const promptString = container.querySelector('.prompt-string')
      expect(promptString.innerHTML).toBe('=&gt;')
    })
  })

  describe('focus', () => {
    it('allows typing immediately', async () => {
      render(<Terminal />)
      const prompt = await getPrompt()
      expect(prompt).toHaveFocus()
    })

    it('focuses the prompt when terminal is clicked', async () => {
      const { container, baseElement } = render(<Terminal />)
      const terminal = container.querySelector('.terminal')
      const prompt = await getPrompt()

      userEvent.click(baseElement)
      expect(prompt).not.toHaveFocus()

      userEvent.click(terminal)
      expect(prompt).toHaveFocus()
    })
  })

  describe('unrecognized command', () => {
    it('does not understand commands not in the list', async () => {
      render(<Terminal />)

      runCommand('not a command')

      const command = await screen.findByRole('textbox', {name: /command/i})
      expect(command).toBeDisabled()
      expect(command.value).toBe('  not a command')

      const understand = screen.getByText("I don't understand 'not'")
      expect(understand).toHaveAttribute('role', 'status')
      expect(understand).toBeInTheDocument()

      const prompt = await getPrompt()
      expect(prompt).not.toBeDisabled()
      expect(prompt.value.trim()).toBe('')
    })
  })

  describe('commands', () => {

    beforeEach(() => {
      render(<Terminal />)
    })

    describe('echo', () => {
      it('should repeat the phrase given', async () => {
        runCommand('echo four score and seven')

        const response = await screen.findByText(/^four score and seven$/)
        expect(response).toHaveAttribute('role', 'status')
        const prompt = await getPrompt()
        expect(prompt.value.trim()).toBe('')
      })
    })

    describe('clear', () => {
      it('should clear the terminal of commands', async () => {
        runCommand('echo be the change')
        runCommand('command not found')

        await screen.findByText("I don't understand 'command'")
        let responses = await screen.findAllByRole('status')
        expect(responses).toHaveLength(3)


        runCommand('clear')
        // time to clear
        wait(100)
        // wait for greeting to be displayed again
        await screen.findByText('Hello')

        // only the greeting is still displayed
        responses = await screen.findAllByRole('status')
        expect(responses).toHaveLength(1)
      })
    })


  })

})
