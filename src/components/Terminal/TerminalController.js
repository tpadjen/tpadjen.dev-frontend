import { BehaviorSubject, combineLatest } from 'rxjs'
import {
  map,
  // tap,
  scan,
  filter,
  shareReplay,
  take,
} from 'rxjs/operators'

export default class TerminalController {

  constructor({ commands: providedCommands, services, prompt = '$'}) {
    this.commandHistory = []
    this.eventStartPosition$$ = new BehaviorSubject(0)
    this.event$$ = new BehaviorSubject(undefined)
    this.allEventList$ = this.event$$.pipe(
      filter(event => event !== undefined),
      scan((events, event) => events.concat(event), []),
      map((events) => events.map((event, i) => ({ ...event, id: i }))),
      shareReplay(1),
    )
    this.currentEvents$ = combineLatest(this.eventStartPosition$$, this.allEventList$).pipe(
      map(([startPosition, eventList]) => eventList.slice(startPosition)),
    )
    this.isReady$$ = new BehaviorSubject(true)
    this.isReady$ = this.isReady$$.asObservable()

    this.historyPosition$$ = new BehaviorSubject(-1)
    this.currentHistoryCommand$ = this.historyPosition$$.asObservable().pipe(
      filter((n) => n >= 0 && n <= this.commandHistory.length),
      map((n) => this.commandHistory[n]),
    )

    this.services = services
    this.prompt = prompt

    this.commands = {
      echo: {
        async execute({ args, term }) {
          term.outputMessage(args.join(' '))
          term.outputBlankLine()
        },
      },
      help: {
        async execute({ term }) {
          term.outputMessage('Available commands: ')
          Object.keys(term.commands).filter((command) => 'help' in term.commands[command])
            .forEach((command) => {
              term.outputMessage(`${term.prompt} ${term.commands[command].help.usage}`, 1)
              term.outputMessage(term.commands[command].help.summary, 2)
            })
          term.outputBlankLine()
        },
      },
      clear: {
        help: {
          usage: 'clear',
          summary: 'clear the console',
          detailed: ['clear the console'],
        },
        async execute({ term }) {
          await term.clearOutput()
          term.runBuiltInCommand('welcome')
        },
      },
      cl: {
        async execute({ term }) {
          term.runBuiltInCommand('clear')
        },
      },
      welcome: {
        async execute({ term }) {
          term.outputMessage('Hello')
          term.outputBlankLine()
        }
      },
      '--Help--': {
        async execute({ commandName, term }) {
          const command = term.commands[commandName]
          if (Array.isArray(command.help.detailed)) {
            term.commands[commandName].help.detailed.forEach((helpLine) => term.outputMessage(helpLine))
          } else {
            term.outputMessage(command.help.detailed || '')
          }
          term.outputBlankLine()
        },
      },
      '--CommandNotFound--': {
        async execute({ commandName }) {
          return Promise.reject(new Error(`I don't understand '${commandName}'`))
        },
      },
    }

    this.addCommands(providedCommands)
  }

  addCommands(commands) {
    this.commands = {
      ...this.commands,
      ...commands,
    }
  }

  clearOutput() {
    return new Promise((resolve) => {
      this.allEventList$.pipe(take(1)).subscribe((eventList) => {
        this.eventStartPosition$$.next(eventList.length)
        resolve()
      })
    })
  }

  decrementHistoryPosition() {
    if (this.historyPosition$$.value > 0) {
      this.historyPosition$$.next(this.historyPosition$$.value - 1)
    }
  }

  incrementHistoryPosition() {
    if (this.historyPosition$$.value !== -1
      && this.historyPosition$$.value < this.commandHistory.length) {
      this.historyPosition$$.next(this.historyPosition$$.value + 1)
    }
  }

  resetHistoryPosition() {
    this.historyPosition$$.next(this.commandHistory.length)
  }

  executeCommand(text) {
    this.isReady$$.next(false)
    const [command, ...args] = text.split(/\s+/)

    this.outputCommand(text)
    this.resetHistoryPosition()

    this._processCommand(command, args)
      .then(() => { // command found
        this._finishCommand()
      }, (error) => {
        this.outputError(error.message)
        this.outputBlankLine()
        this._finishCommand()
      })
  }

  // directly run a command, such as help or welcome
  async runBuiltInCommand(commandName, args) {
    if (!this.commands[commandName]) {
      this.outputError(`${commandName} not found`)
      return
    }

    return this.commands[commandName].execute({ commandName, args, term: this })
  }

  outputMessage(message, indentLevel = 0) {
    this.event$$.next({
      type: 'output',
      text: `${' '.repeat(indentLevel * 4)}${message}`,
    })
  }

  outputError(message) {
    this.event$$.next({
      type: 'error',
      text: message,
    })
  }

  outputCommand(text) {
    const command = {
      type: 'command',
      text: text,
      order: this.commandHistory.length,
    }
    this.commandHistory.push(command)
    this.event$$.next(command)
  }

  outputBlankLine() {
    this.event$$.next({
      type: 'blank',
      text: '',
    })
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  _finishCommand() {
    setTimeout(() => {
      this.isReady$$.next(true)
    }, 200)
  }

  _processCommand(commandName, args) {
    if (commandName in this.commands) {
      if (args && (args.includes('-h') || args.includes('--help'))) {
        return this.commands['--Help--'].execute({ commandName, args, term: this })
      }
      return this.commands[commandName].execute({ commandName, args, term: this })
    }
    return this.commands['--CommandNotFound--'].execute({ commandName, args, term: this })
  }

}
