
const loginAdmin = (term) => {
  return term.services.userService.signInGoogleUser()
    .then((user) => {
      term.outputMessage(`Welcome ${user.name}`)
      redirect('/admin', 1000, term)
    })
    .catch(error => {
      console.error('error', error)
      throw (new Error(error.response && error.response.data && error.response.data.message || 'Error'))
    })
}

const loginWithTicket = async (args, term) => {
  const [ticket] = args
  if (!(ticket && ticket.trim())) {
    term.outputMessage('Please provide an invitation code')
    term.outputBlankLine()
    term.outputMessage('> login your-code', 1)
    term.outputBlankLine()
    return
  }
  if (ticket.trim() === 'your-invitation-code') {
    term.outputError('Ha')
    await term.sleep(400)
    term.outputMessage('Please provide a real invitation code')
    term.outputBlankLine()
    return
  }

  term.outputMessage(`Logging in with code: ${ticket}...`)
  try {
    const user = await term.services.userService.login(ticket)
    if (user) {
      term.outputMessage(`Welcome ${user.name}!`)
    } else {
      term.outputError('Code not found')
    }
    redirect('/profile', 1000, term)
  } catch (err) {
    console.error(err)
    term.outputError('Code not found')
    term.outputBlankLine()
  }
}

const redirect = (destination, wait, term) => {
  term.outputMessage('Redirecting...')
  term.outputBlankLine()
  setTimeout(() => {
    term.services.history.push(destination)
  }, wait)
}

export const terminalCommands = {
  welcome: {
    async execute({ term }) {
      term.outputMessage('Welcome to tpadjen.dev')
      term.outputBlankLine()
      term.outputMessage('You must have an invitation code to proceed')
      term.outputBlankLine()
      term.outputMessage('> login your-invitation-code', 1)
      term.outputBlankLine()
    },
  },
  login: {
    help: {
      usage: 'login your-invitation-code',
      summary: 'Use your invitation code to enter',
      detailed: ['login ', '  > login your-invitation-code', '  Use your code to enter'],
    },
    async execute({ args, term }) {
      if (term.services.user) {
        term.outputError(`${term.services.user.name} is already logged in`)
        term.outputBlankLine()
        return
      }

      if (args[0] === 'admin' && args.length === 1) {
        return await loginAdmin(term)
      }

      return loginWithTicket(args, term)
    }
  },
  user: {
    async execute({ term }) {
      term.outputMessage(term.services.user ? term.services.user.name : 'No user logged in')
      term.outputBlankLine()
    }
  },
  logout: {
    help: {
      usage: 'logout',
      summary: 'Exit the app',
      detailed: ['logout', '    Exit the app'],
    },
    async execute({ term }) {
      term.services.userService.logout()
      term.outputMessage('Logged Out')
      term.outputBlankLine()
    }
  },
  '--CommandNotFound--': {
    async execute({ commandName, term }) {
      term.outputError(`I don't understand '${ commandName }'`)
      term.outputMessage('Try:')
      term.outputMessage('> help', 1)
      term.outputBlankLine()
    },
  },
  help: {
    async execute({ term }) {
      term.outputMessage('Available commands: ');
      ['login', 'clear'].forEach((command) => {
        term.outputMessage(`${term.prompt} ${term.commands[command].help.usage}`, 1)
        term.outputMessage(term.commands[command].help.summary, 2)
      })
      term.outputBlankLine()
    },
  },
}
