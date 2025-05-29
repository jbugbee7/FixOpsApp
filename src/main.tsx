
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Mobile-optimized touch handling
let lastTouchEnd = 0;

// Prevent double-tap zoom only on non-interactive elements
document.addEventListener('touchend', function(event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    const target = event.target as HTMLElement;
    if (target && !target.closest('button, input, textarea, select, a, [role="button"], [tabindex]')) {
      event.preventDefault();
    }
  }
  lastTouchEnd = now;
}, { passive: false });

// Prevent pinch zoom while allowing other gestures
document.addEventListener('gesturestart', function(event) {
  event.preventDefault();
}, { passive: false });

// Mobile viewport optimization
const metaViewport = document.querySelector('meta[name="viewport"]');
if (metaViewport) {
  metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
}

// Faster mobile rendering
const root = document.getElementById("root");
if (root) {
  // Optimize for mobile performance
  root.style.touchAction = 'manipulation';
  createRoot(root).render(<App />);
}
