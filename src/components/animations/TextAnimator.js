import React, { useState, useEffect, Fragment } from 'react'


const TextAnimator = ({
  animations,
  type: defaultType,
  replace = false,
  color: defaultColor = '#ffffff',
  size,
}) => {
  const [shouldShow, setShouldShow] = useState(new Array(animations.length).fill(false))

  useEffect(() => {
    const timers = []
    animations.forEach((animation, i) => {
      timers.push(setTimeout(() => {
        let newShouldShow
        if (replace) {
          newShouldShow = shouldShow.map((show, j) => j === i ? true : show)
        } else {
          newShouldShow = shouldShow.map((show, j) => j <= i ? true : show)
        }
        setShouldShow(newShouldShow)
      }, animation.start))
    })
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [])

  const animationForIndex = (animation, index) => {
    const { type, size: animSize, start, color, ...props } = animation
    const Animation = type || defaultType
    return (
      <Fragment key={animation.out ? -1*start : start}>
        {shouldShow[index] && (
          <Animation
            color={color || defaultColor}
            size={animSize || size || 80}
            {...props}
          />
        )}
      </Fragment>
    )
  }

  const els = animations.map((animation, i) => animationForIndex(animation, i))

  return els
}

export default TextAnimator
