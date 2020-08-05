import React from 'react'
import styled from 'styled-components'


const ProblemSolved = ({ problem }) => {
  return (
    <StyledProblem>
      <h3>Problem Solved</h3>
      <p>{problem}</p>
    </StyledProblem>
  )
}

const StyledProblem = styled.div`
  margin-left: 1em;

  h3, p {
    display: inline-block;
  }

  h3 {
    margin-right: 1em;
  }
`

export default ProblemSolved
