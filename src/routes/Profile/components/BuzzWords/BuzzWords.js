import React from 'react'
import styled from 'styled-components'
import { Colors } from '../../../../theme'


const BuzzWords = ({ words }) => {
  return (
    <Grid>
      {words.map(word =>
        <Word key={word}>{word}</Word>
      )}
    </Grid>
  )
}

const Grid = styled.div`
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
`

const Word = styled.div`
  background-color: ${Colors.me};
  font-size: 1.2em;
  line-height: 1.4em;
  padding: 0 0.6em;
  margin-left: 0.5em;
  margin-right: 0.2em;
  border-radius: 0.5em;
  color: ${Colors.terminal};
  margin-bottom: 1em;
`

export default BuzzWords
