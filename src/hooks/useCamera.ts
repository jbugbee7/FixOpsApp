
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
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      console.log('Camera stream obtained:', stream);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          const video = videoRef.current;
          if (video) {
            video.onloadedmetadata = () => {
              console.log('Video metadata loaded');
              video.play().then(() => {
                console.log('Video playing');
                resolve(true);
              }).catch((error) => {
                console.error('Error playing video:', error);
              });
            };
          }
        });
        
        setIsCapturing(true);
        console.log('Camera started successfully');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions and try again.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
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
