import React from 'react'
import { animated, useTransition } from 'react-spring'


const FadeInOut = ({ itemKey, children, wrapStyle = {
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
}}) => {
  const transitions = useTransition(children, () => itemKey, {
    leave: { opacity: 0 },
    from: { opacity: 0 },
    enter: { opacity: 1 }
  })

  return (
    <div style={wrapStyle}>
      {transitions.map(({ item: child, props, key }) => (
        <animated.div
          style={{...props, position: 'absolute', width: '100%' }}
          key={key}
        >
          {child}
        </animated.div>
      ))}
    </div>
  )
}

export default FadeInOut
