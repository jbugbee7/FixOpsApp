
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Safari-friendly touch event handling
let lastTouchEnd = 0;

// Only prevent double-tap zoom on specific elements, not globally
document.addEventListener('touchend', function(event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    // Only prevent on non-interactive elements
    const target = event.target as HTMLElement;
    if (target && !target.closest('button, input, textarea, select, a, [role="button"]')) {
      event.preventDefault();
    }
  }
  lastTouchEnd = now;
}, { passive: false });

// Prevent pinch zoom but allow other gestures
document.addEventListener('gesturestart', function(event) {
  event.preventDefault();
}, { passive: false });

createRoot(document.getElementById("root")!).render(<App />);
