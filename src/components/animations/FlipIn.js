import React from 'react'
import { animated, useSpring } from 'react-spring'
import './JumpIn.css'


const config = { mass: 0.4, tension: 140, friction: 24 }
const outConfig = { mass: 0.6, tension: 20, friction: 6 }

const FlipIn = ({icon, text, color, out = false, reverse = false}) => {

  const degrees = reverse ? -90 : 90

  const { rotation } = useSpring({
    config: out ? outConfig : config,
    rotation: out ? degrees : 0,
    from: { rotation: out ? 0 : degrees },
  })

  const animStyles = {
    transform: rotation.interpolate(rotation => `rotate3d(1, 0, 0, ${rotation}deg)`),
    color: color,
    padding: 0,
  }

  return (
    <div className="JumpIn">
      <div className="trails-main">
        <animated.pre
          className="trails-text"
          style={animStyles}
        >
          {icon ? icon : text}
        </animated.pre>
      </div>
    </div>
  )
}

export default FlipIn
