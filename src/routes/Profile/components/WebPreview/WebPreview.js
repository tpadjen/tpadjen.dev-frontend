import React from 'react'
import styled from 'styled-components'
import { Colors } from '../../../../theme'


const WebPreview = ({ url, showBanner = true }) => {
  return (
    <Preview>
      {showBanner &&
        <h2>Live Preview of: <a href={url}>{url.replace('https://', '')}</a></h2>
      }
      <div className="preview-frame" >
        <iframe src={url}></iframe>
      </div>
    </Preview>
  )
}

const Preview = styled.div`
  transform: scale(0.9);
  position: relative;
  top: -1em;
  margin-bottom: -1.0em;
  box-shadow: 9px 10px 26px -5px rgba(0,0,0,0.75);


  .preview-frame {
    overflow: hidden;
    padding-top: 65%;
    position: relative;
  }

  h2 {
    background-color: ${Colors.text};
    color: ${Colors.background};
    margin-bottom: 0;
    text-align: center;
    padding: 0.5em;
    a {
      color: ${Colors.background}
    }

    a:visited {
      color: ${Colors.code};
    }
  }

  iframe {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    border: 0;
    body {
      overflow: hidden;
    }
  }
`

export default WebPreview
