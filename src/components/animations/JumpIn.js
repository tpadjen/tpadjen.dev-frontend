import React, { useEffect, useState } from 'react'
import { animated, useTrail, useSpring } from 'react-spring'
import './JumpIn.css'


const JumpIn = ({
  size = '1em',
  icon,
  text,
  color,
  trailSpringConfig = { mass: 0.2, tension: 140, friction: 8 },
  colorSpringConfig = { mass: 0.5, tension: 140, friction: 20 },
}) => {
  const [currentColor, setCurrentColor] = useState(color)
  const [previousColor, setPreviousColor] = useState(color)

  const trail = useTrail(icon? 1 : text.length, {
    config: trailSpringConfig,
    height: 0,
    from: { height: size, },
  })

  useEffect(() => {
    setPreviousColor(currentColor)
    setCurrentColor(color)
  }, [color])

  const { color: springColor } = useSpring({
    config: colorSpringConfig,
    color: currentColor,
    from: { color: previousColor }
  })

  return (
    <div className="JumpIn">
      <div className="trails-main">
        {trail.map(({ height }, index) => (
          <animated.pre
            key={index}
            className="trails-text"
            style={{
              transform: height.interpolate(height => `translate3d(0,${height}px,0)`),
              color: springColor
            }}
          >
            {icon ? icon : text[index]}
          </animated.pre>
        ))}
      </div>
    </div>
  )
}

export default JumpIn
