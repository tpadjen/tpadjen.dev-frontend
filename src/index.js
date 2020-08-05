import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import UserProvider from './auth/UserProvider'
import { MDXProvider } from '@mdx-js/react'
import CodeBlock from './components/CodeBlock/CodeBlock'


const mdxComponents = { pre: CodeBlock }

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <MDXProvider components={mdxComponents}>
        <App />
      </MDXProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
