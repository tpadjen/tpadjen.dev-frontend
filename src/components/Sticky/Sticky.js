import React, { useState, useEffect, useRef, forwardRef } from 'react'


/**
 * Sticky HOC
 *
 * Wrap a component to make a it stick to the view, for example the top of the page
 * when scrolling.
 *
 * Used in tandem with one of useStickyElementListener or useStickyListener
 *
 * Props:
 *   isSticky [boolean] - whether or not to stick
 *   top [number] - sets css 'top' styling when sticky. Default 0
 *   stickyStyle [{}] - set other styles for the div that wraps the given component
 */
const Sticky = (WrappedComponent) => {
  return forwardRef(
    function Sticky({ isSticky, top = 0, stickyStyle = {}, ...props}, ref) {
      return (
        <div
          className="Sticky"
          ref={ref}
          style={{
            ...stickyStyle,
            position: isSticky ? 'sticky' : stickyStyle.position,
            top: isSticky ? top : undefined
          }}
        >
          <WrappedComponent {...props}></WrappedComponent>
        </div>
      )
    }
  )
}

/**
 * useStickyElementListener
 *
 * Used when the window is NOT the element that is managing the scrolling that
 * determines stickyness.
 *
 * Usage:
 *   * set onScroll={handleScroll} on the element that is scrollable
 *   * pass isSticky as a prop and stickyRef as the ref to the Sticky wrapped
 *     component that needs to stick
 */
export const useStickyElementListener = () => {
  const [isSticky, setIsSticky] = useState(false)
  const stickyRef = useRef(null)
  const handleScroll = () => {
    if (stickyRef.current) {
      setIsSticky(stickyRef.current.getBoundingClientRect().top <= 0)
    }
  }

  return { isSticky, stickyRef, handleScroll }
}

/**
 * useStickyListener
 *
 * Used when the window IS the element that is managing the scrolling that
 * determines stickyness.
 *
 * Usage:
 *   * pass isSticky as a prop and stickyRef as the ref to the Sticky wrapped
 *     component that needs to stick
 */
export const useStickyListener = () => {
  const { isSticky, stickyRef, handleScroll } = useStickyElementListener()

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', () => handleScroll)
    }
  }, [])

  return { isSticky, stickyRef }
}

export default Sticky
