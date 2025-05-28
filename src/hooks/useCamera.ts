
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

      // Try different constraint configurations for better mobile compatibility
      const constraints = [
        // Try rear camera first (ideal for mobile)
        { 
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 }
          } 
        },
        // Fallback to any camera
        { 
          video: { 
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 }
          } 
        },
        // Basic fallback
        { video: true }
      ];

      let stream: MediaStream | null = null;
      let lastError: Error | null = null;

      // Try each constraint configuration
      for (const constraint of constraints) {
        try {
          console.log('Trying camera constraint:', constraint);
          stream = await navigator.mediaDevices.getUserMedia(constraint);
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
          errorMessage += "Please allow camera permissions and try again.";
        } else if (lastError?.name === 'NotFoundError') {
          errorMessage += "No camera found on this device.";
        } else if (lastError?.name === 'NotReadableError') {
          errorMessage += "Camera is already in use by another application.";
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
      console.log('Video tracks:', stream.getVideoTracks());
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Set video attributes for better mobile compatibility
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.muted = true;
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current;
          if (!video) {
            reject(new Error('Video element not available'));
            return;
          }

          const handleLoadedMetadata = () => {
            console.log('Video metadata loaded');
            console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
            
            video.play().then(() => {
              console.log('Video playing successfully');
              resolve();
            }).catch((error) => {
              console.error('Error playing video:', error);
              reject(error);
            });
          };

          const handleError = (error: Event) => {
            console.error('Video error:', error);
            reject(new Error('Video failed to load'));
          };

          video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
          video.addEventListener('error', handleError, { once: true });

          // Timeout after 10 seconds
          setTimeout(() => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('error', handleError);
            reject(new Error('Video loading timeout'));
          }, 10000);
        });
        
        setIsCapturing(true);
        console.log('Camera started successfully');
        
        toast({
          title: "Camera Ready",
          description: "Camera is now active and ready to capture photos.",
        });
      }
    } catch (error) {
      console.error('Error in startCamera:', error);
      toast({
        title: "Camera Error",
        description: "Failed to start camera. Please try again.",
        variant: "destructive"
      });
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
