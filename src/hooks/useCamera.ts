
import { useState, useRef, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

export const useCamera = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia not supported');
        toast({
          title: "Camera Not Supported",
          description: "Your browser doesn't support camera access. Please use a modern browser.",
          variant: "destructive"
        });
        return;
      }

      // Enhanced constraint configurations for better mobile compatibility
      const constraints = [
        // Try rear camera first with high quality (ideal for mobile documentation)
        { 
          video: { 
            facingMode: { exact: 'environment' },
            width: { ideal: 1920, max: 4096 },
            height: { ideal: 1080, max: 3072 },
            aspectRatio: { ideal: 16/9 }
          } 
        },
        // Try rear camera with medium quality
        { 
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 }
          } 
        },
        // Try any rear camera
        { 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        },
        // Fallback to front camera if rear not available
        { 
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        },
        // Basic fallback with any camera
        { 
          video: { 
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 }
          } 
        },
        // Minimal fallback
        { video: true }
      ];

      let stream: MediaStream | null = null;
      let lastError: Error | null = null;
      let usedConstraint: any = null;

      // Try each constraint configuration
      for (const constraint of constraints) {
        try {
          console.log('Trying camera constraint:', constraint);
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          usedConstraint = constraint;
          console.log('Camera stream obtained with constraint:', constraint);
          break;
        } catch (error) {
          console.error('Failed with constraint:', constraint, error);
          lastError = error as Error;
        }
      }

      if (!stream) {
        console.error('All camera access attempts failed. Last error:', lastError);
        
        let errorMessage = "Unable to access camera. ";
        if (lastError?.name === 'NotAllowedError') {
          errorMessage += "Please allow camera permissions in your browser settings and try again.";
        } else if (lastError?.name === 'NotFoundError') {
          errorMessage += "No camera found on this device.";
        } else if (lastError?.name === 'NotReadableError') {
          errorMessage += "Camera is already in use by another application.";
        } else if (lastError?.name === 'OverconstrainedError') {
          errorMessage += "Camera doesn't support the requested settings. Trying with basic settings...";
        } else {
          errorMessage += "Please check your camera permissions and try again.";
        }

        toast({
          title: "Camera Error",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Camera stream obtained:', stream);
      console.log('Used constraint:', usedConstraint);
      
      // Log camera capabilities
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        console.log('Camera settings:', settings);
        console.log('Camera capabilities:', videoTrack.getCapabilities?.());
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Enhanced video attributes for mobile compatibility
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.setAttribute('muted', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;
        
        // Wait for video to be ready with improved error handling
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current;
          if (!video) {
            reject(new Error('Video element not available'));
            return;
          }

          const handleLoadedMetadata = () => {
            console.log('Video metadata loaded');
            console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
            
            // Ensure video plays
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log('Video playing successfully');
                resolve();
              }).catch((error) => {
                console.error('Error playing video:', error);
                // Try to continue anyway for some mobile browsers
                resolve();
              });
            } else {
              resolve();
            }
          };

          const handleCanPlay = () => {
            console.log('Video can play');
            if (!video.paused) {
              resolve();
            }
          };

          const handleError = (error: Event) => {
            console.error('Video error:', error);
            reject(new Error('Video failed to load'));
          };

          // Multiple event listeners for better compatibility
          video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
          video.addEventListener('canplay', handleCanPlay, { once: true });
          video.addEventListener('error', handleError, { once: true });

          // Force load if needed
          if (video.readyState >= 2) {
            handleLoadedMetadata();
          }

          // Timeout after 15 seconds (increased for mobile)
          setTimeout(() => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            reject(new Error('Video loading timeout'));
          }, 15000);
        });
        
        setIsCapturing(true);
        console.log('Camera started successfully');
        
        // Show which camera is being used
        const videoTrack = stream.getVideoTracks()[0];
        const facingMode = videoTrack.getSettings().facingMode || 'unknown';
        const cameraType = facingMode === 'environment' ? 'rear camera' : 
                          facingMode === 'user' ? 'front camera' : 'camera';
        
        toast({
          title: "Camera Ready",
          description: `Connected to ${cameraType}. Ready to capture photos.`,
        });
      }
    } catch (error) {
      console.error('Error in startCamera:', error);
      
      let errorMessage = "Failed to start camera. ";
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage += "Camera took too long to load. Please try again.";
        } else if (error.message.includes('not available')) {
          errorMessage += "Camera not available. Please check permissions.";
        } else {
          errorMessage += "Please check your camera and try again.";
        }
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Clean up on error
      stopCamera();
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind, track.label);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load(); // Reset video element
    }
    
    setIsCapturing(false);
    console.log('Camera stopped');
  };

  return {
    isCapturing,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera
  };
};
