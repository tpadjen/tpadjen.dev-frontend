import React, { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import useImage from 'use-image'
import _ from 'lodash'
import './LogoDisplay.css'


const LogoDisplay = ({ logos, width, height, ...rest }) => {
  const [logo, setLogo] = useState(_.sample(logos))

  const logoDone = () => {
    let newLogo = _.sample(logos)
    while (newLogo === logo) newLogo = _.sample(logos)
    setLogo(newLogo)
  }

  return (
    <Stage
      width={width || window.innerWidth}
      height={height || window.innerHeight}
      className="LogoDisplay"
    >
      <Layer>
        <AnimatedLogo
          {...rest}
          canvasWidth={width}
          canvasHeight={height}
          key={logo}
          logo={logo}
          done={logoDone}
        />
      </Layer>
    </Stage>
  )
}

const AnimatedLogo = ({
  canvasWidth,
  canvasHeight,
  logo,
  duration = 0.75,
  logoScale = 0.667,
  done,
}) => {
  const [image] = useImage(logo)
  const [scale, setScale] = useState(undefined)
  let imageNode = useRef()

  const start = () => {
    let timeout
    if (imageNode) {
      if (scale && imageNode.current.height() > 0) { // ready to draw

        imageNode.current.absolutePosition({
          x: 0 - scale*imageNode.current.width(),
          y: canvasHeight/2 - scale*imageNode.current.height()/2
        })

        // make wider logos slightly faster
        const adjustedDuration = duration + duration * imageNode.current.width()
          / imageNode.current.height() * 0.15

        imageNode.current.to({
          x: canvasWidth,
          duration: adjustedDuration,
        })

        timeout = setTimeout(done, adjustedDuration * 1000)
      } else {
        // move temporarily off screen while size is calculated
        imageNode.current.absolutePosition({
          x: -3000,
          y: -3000,
        })
      }
    }
    return timeout
  }

  useEffect(() => {
    // if scale not already set and image has a size
    if (!scale && imageNode.current && imageNode.current.height() > 0) {
      setScale((canvasHeight * logoScale) / imageNode.current.height())
    }
  })

  useEffect(() => {
    imageNode.current.scale({ x: scale, y: scale })
    const timeout = start()
    return () => clearTimeout(timeout)
  }, [scale])

  return (
    <Image
      image={image}
      ref={imageNode}
    />
  )
}

export default LogoDisplay
