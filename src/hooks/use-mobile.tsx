
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Faster mobile detection
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);
    };
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkMobile);
    checkMobile(); // Initial check
    
    return () => mql.removeEventListener("change", checkMobile);
  }, []);

  return !!isMobile;
}

export function useViewport() {
  const [viewport, setViewport] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  React.useEffect(() => {
    let ticking = false;
    
    const handleResize = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Mobile-optimized viewport handling
          const height = window.visualViewport 
            ? window.visualViewport.height 
            : window.innerHeight;
          
          setViewport({
            width: window.innerWidth,
            height: height,
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    // Optimized event listeners for mobile
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize, { passive: true });
      window.visualViewport.addEventListener('scroll', handleResize, { passive: true });
    } else {
      window.addEventListener('resize', handleResize, { passive: true });
    }

    handleResize(); // Initial call

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return viewport;
}

export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    // Optimized touch detection
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileUA = /Mobi|Android/i.test(navigator.userAgent);
    
    setIsTouchDevice(hasTouch || isMobileUA);
  }, []);

  return isTouchDevice;
}

export function useIsSafari() {
  const [isSafari, setIsSafari] = React.useState(false);

  React.useEffect(() => {
    // Optimized Safari detection
    const userAgent = navigator.userAgent;
    const isSafariDesktop = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isSafariMobile = /iPhone|iPad|iPod/.test(userAgent);
    
    setIsSafari(isSafariDesktop || isSafariMobile);
  }, []);

  return isSafari;
}

// New hook for mobile performance optimization
export function useMobilePerformance() {
  React.useEffect(() => {
    // Optimize for mobile performance
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && connection.effectiveType === 'slow-2g') {
        // Implement low-bandwidth optimizations
        document.documentElement.classList.add('low-bandwidth');
      }
    }
    
    // Preload critical resources on mobile
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      document.documentElement.classList.add('mobile-optimized');
    }
  }, []);
}
