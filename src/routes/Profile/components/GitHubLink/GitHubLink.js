import React from 'react'
import styled from 'styled-components'
import { Colors } from '../../../../theme'
import { AiFillGithub } from 'react-icons/ai'


const GitHubLink = ({ projectNames }) => {
  const names = Array.isArray(projectNames) ? projectNames : [projectNames]
  return (
    <GitHubLinks>
      {names.map(name => (
        <Link key={name}>
          <AiFillGithub />
          <a
            href={`https://github.com/tpadjen/${names}`}
          >tpadjen/{name}</a>
        </Link>
      ))}
    </GitHubLinks>
  )
}

const GitHubLinks = styled.div`
  margin-bottom: 1em;
`

const Link = styled.div`
  font-size: 1.1em;
  a {
    color: ${Colors.text};
    padding-left: 0.5em;
    position: relative;
    top: -0.4em;
  }
  a:visited {
    color: ${Colors.code};
  }

  svg {
    height: 1.5em;
    width: 1.5em;
  }
`

export default GitHubLink
