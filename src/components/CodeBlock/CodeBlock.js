import React from 'react'
import styled from 'styled-components'
// import { Colors } from '../../theme'
import Highlight, { defaultProps } from 'prism-react-renderer'
import './one-monokai.css'


const Pre = styled.pre`
  text-align: left;
  margin: 2em 0 !important;
  padding: 1.5em !important;
  border-radius: 4px;
  border: 1px solid #666;
  box-shadow: 10px 10px 38px -21px rgba(0,0,0,1);
`

const Line = styled.div`
  display: table-row;
`

const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1.5em;
  user-select: none;
  opacity: 0.5;
`

const LineContent = styled.span`
  display: table-cell;
  padding-right: 1.5em;
`

const CodeBlock = (props) => {
  const code = props.children.props.children.trim()
  const className = props.children.props.className
  const language = className.replace(/language-/, '')

  return (
    <Highlight {...defaultProps} theme={undefined} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          {tokens.map((line, i) => (
            <Line key={i} {...getLineProps({ line, key: i })}>
              <LineNo>{i + 1}</LineNo>
              <LineContent>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </LineContent>
            </Line>
          ))}
        </Pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
