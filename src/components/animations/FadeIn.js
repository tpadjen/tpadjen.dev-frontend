import React from 'react'
import { animated, useSpring } from 'react-spring'


const FadeIn = ({
  color,
  background,
  colorSpringConfig = { mass: 0.5, tension: 140, friction: 20 },
  children,
}) => {

  const { color: springColor, opacity } = useSpring({
    config: colorSpringConfig,
    color: color,
    opacity: 1,
    from: { color: background, opacity: 0 }
  })

  return (
    <animated.div
      className="FadeIn"
      style={{
        color: springColor,
        opacity: opacity,
        // height: '100%',
        // width: '100%',
      }}
    >
      {children}
    </animated.div>
  )
}

export default FadeIn
