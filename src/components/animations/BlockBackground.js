import React, { Component, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import './BlockBackground.css'
import { Colors } from '../../theme'


const BlockAnimation = ({
  size,
  bounds,
  onComplete,
  springConfig = {
    mass: 0.05,
    friction: 7,
  },
}) => {
  const [completed, setCompleted] = useState(false)

  const springProps = useSpring({
    config: springConfig,
    from: { left: '0px', top: '0px', width: `${size}px`, height: '0px', background: Colors.terminal },
    to: async (next) => {
      await next({ width: `${size}px`, background: Colors.blue })
      await next({ height: `${bounds.height}px`, background: Colors.blue })
      await next({ height: `${size}px`, top: `${bounds.height - size}px`, background: Colors.text })
      await next({ left: '0px', width: `${bounds.width}px`, background: Colors.text })
      await next({ left: `${bounds.width - size}px`, width: `${size}px`, background: Colors.red })
      await next({ top: '0px', height: `${bounds.height}px`, background: Colors.red })
      await next({ height: `${size}px`, background: Colors.background })
      await next({ left: '0px', width: `${bounds.width}px`, background: Colors.background })
    },
    onRest: () => {
      setCompleted(true)
      onComplete()
    }
  })

  return (
    <animated.div className="script-box" style={{
      ...springProps,
      position: completed ? 'static' : 'fixed'
    }} ></animated.div >
  )
}

class BlockBackground extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bounds: undefined,
      size: undefined,
      finished: false
    }
    this.onAnimationFinished = this.onAnimationFinished.bind(this)
  }

  onAnimationFinished() {
    this.setState({
      ...this.state,
      finished: true,
    })
    if (this.props.onComplete) this.props.onComplete()
  }

  componentDidMount() {
    const heightFactor = this.props.isSmall ? 0.08 : 0.14286
    const width = window.innerWidth || document.documentElement.clientWidth ||
      document.body.clientWidth
    const height = window.innerHeight || document.documentElement.clientHeight ||
      document.body.clientHeight
    this.setState({
      ...this.state,
      bounds: { width, height },
      size: height * heightFactor
    })
  }

  shouldComponentUpdate(_nextProps, nextState) {
    return this.props.shouldNotAnimate || nextState.finished || this.hasInitialSizes(nextState)
  }

  hasInitialSizes(nextState) {
    return !(this.state.size && this.state.bounds) && (nextState.size && nextState.bounds)
  }

  render() {
    const shouldRender = !this.props.shouldNotAnimate && this.state.size &&
      this.state.bounds && !this.state.finished

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: this.state.finished || this.props.shouldNotAnimate ? 'static' : 'fixed',
          gridColumn: '1 / -1',
          gridRow: this.props.shouldNotAnimate || this.state.finished ? '1' : '1 / -1'
        }}
      >
        {shouldRender &&
          <BlockAnimation
            size={this.state.size}
            bounds={this.state.bounds}
            onComplete={this.onAnimationFinished}
            springConfig={this.props.springConfig}
          />
        }
        {(this.props.shouldNotAnimate || this.state.finished) &&
          <div className="blockChildren finished" style={{
            width: '100%',
            gridColumn: '1 / -1',
            backgroundColor: Colors.background,
          }}>{this.props.children}</div>
        }
      </div>
    )
  }
}

export default BlockBackground
