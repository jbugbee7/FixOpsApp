
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Enhanced mobile utilities for better responsive design
export function useViewport() {
  const [viewport, setViewport] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  React.useEffect(() => {
    const handleResize = () => {
      // Safari-specific viewport handling
      const height = window.visualViewport 
        ? window.visualViewport.height 
        : window.innerHeight;
      
      setViewport({
        width: window.innerWidth,
        height: height,
      })
    }

    // Use visualViewport API if available (Safari support)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
      window.visualViewport.addEventListener('scroll', handleResize)
    } else {
      window.addEventListener('resize', handleResize)
    }

    // Initial call
    handleResize()

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
        window.visualViewport.removeEventListener('scroll', handleResize)
      } else {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return viewport
}

export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)

  React.useEffect(() => {
    const checkTouch = () => {
      // Better Safari detection
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      setIsTouchDevice(hasTouch || isSafari)
    }
    
    checkTouch()
  }, [])

  return isTouchDevice
}

// New hook specifically for Safari detection
export function useIsSafari() {
  const [isSafari, setIsSafari] = React.useState(false)

  React.useEffect(() => {
    const checkSafari = () => {
      const userAgent = navigator.userAgent
      const isSafariDesktop = /^((?!chrome|android).)*safari/i.test(userAgent)
      const isSafariMobile = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
      
      setIsSafari(isSafariDesktop || isSafariMobile)
    }
    
    checkSafari()
  }, [])

  return isSafari
}
