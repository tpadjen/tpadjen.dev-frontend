import React from 'react'
import styled from 'styled-components'
import { Colors } from '../../../theme'


const Job = ({ job }) => {
  return (
    <StyledJob>
      <h2 className="title">{job.title}</h2>
      <h3 className="company">{job.company}</h3>
      {job.start && <h3 className="time-frame">{job.start} - {job.end}</h3>}
      <h4 className="location">{job.location}</h4>
      {job.details && <job.details />}
    </StyledJob>
  )
}

const StyledJob = styled.div`
  margin: 3em 0;
  border: 2px solid ${Colors.text};
  padding: 2em;

  .company, .time-frame {
    display: inline-block;
  }

  .time-frame {
    position: absolute;
    right: 4em;
  }

  .company {
    font-style: italic;
  }

  .location {
    margin-top: 0;
  }

  li {
    line-height: 1.55em;
    padding-bottom: 2px;
    padding-top: 2px;
  }

  code {
    color: ${Colors.code};
  }
`

export default Job
