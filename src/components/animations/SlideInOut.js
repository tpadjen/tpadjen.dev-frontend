import React from 'react'
import { useTransition, animated } from 'react-spring'


const SlideInOut = ({ selected, slides, ...rest }) => {

  const transitions = useTransition(selected, s => s, {
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  })

  return (
    transitions.map(({ item, key, props }) => {
      const slide = slides.find(slide => item === slide.name)
      const Page = slide ? slide.page : null
      return <animated.div key={key} style={props}>
        {Page ? <Page {...rest} /> : null}
      </animated.div>
    })
  )
}

export default SlideInOut
