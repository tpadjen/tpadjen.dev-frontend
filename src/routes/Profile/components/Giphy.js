import React from 'react'
import styled from 'styled-components'


const Giphy = ({ src, width = '100%', paddingBottom = '56%' }) => (
  <GiphyWrapper>
    <div
      style={{
        width,
        height:0,
        paddingBottom,
        position: 'relative'
      }}
    >
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ position: 'absolute'}}
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen />
    </div>
  </GiphyWrapper>

)

const GiphyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 1.5em 0 2em 0;
`

export default Giphy
