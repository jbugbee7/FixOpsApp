
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Trash2, X } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

interface CameraCaptureProps {
  onPhotosChange: (photos: string[]) => void;
  photos: string[];
}

const CameraCapture = ({ onPhotosChange, photos }: CameraCaptureProps) => {
  const { user } = useAuth();
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !user) {
      console.error('Missing required elements for photo capture');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast({
        title: "Camera Error",
        description: "Camera feed not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get canvas context');
      return;
    }

    ctx.drawImage(video, 0, 0);
    console.log('Photo captured to canvas');
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error('Failed to create blob from canvas');
        return;
      }

      setUploading(true);
      try {
        const fileName = `${user.id}/${Date.now()}.jpg`;
        console.log('Uploading photo:', fileName);
        
        const { data, error } = await supabase.storage
          .from('case-photos')
          .upload(fileName, blob, {
            contentType: 'image/jpeg'
          });

        if (error) {
          console.error('Error uploading photo:', error);
          toast({
            title: "Upload Error",
            description: "Failed to upload photo. Please try again.",
            variant: "destructive"
          });
          return;
        }

        console.log('Photo uploaded successfully:', data);

        // Get public URL for the uploaded photo
        const { data: { publicUrl } } = supabase.storage
          .from('case-photos')
          .getPublicUrl(fileName);

        console.log('Public URL generated:', publicUrl);
        onPhotosChange([...photos, publicUrl]);
        
        toast({
          title: "Photo Captured",
          description: "Photo uploaded successfully.",
        });
        
        stopCamera();
      } catch (error) {
        console.error('Error capturing photo:', error);
        toast({
          title: "Capture Error",
          description: "Failed to capture photo. Please try again.",
          variant: "destructive"
        });
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg', 0.8);
  };

  const removePhoto = async (photoUrl: string, index: number) => {
    try {
      // Extract file path from URL for deletion
      const urlParts = photoUrl.split('/');
      const fileName = `${user?.id}/${urlParts[urlParts.length - 1]}`;
      
      await supabase.storage
        .from('case-photos')
        .remove([fileName]);

      const updatedPhotos = photos.filter((_, i) => i !== index);
      onPhotosChange(updatedPhotos);
      
      toast({
        title: "Photo Removed",
        description: "Photo deleted successfully.",
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Delete Error",
        description: "Failed to delete photo.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
          <Camera className="h-5 w-5" />
          <span>Photos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Controls */}
        <div className="flex space-x-2">
          {!isCapturing ? (
            <Button
              type="button"
              onClick={startCamera}
              className="flex items-center space-x-2"
              variant="outline"
            >
              <Camera className="h-4 w-4" />
              <span>Take Photo</span>
            </Button>
          ) : (
            <div className="space-x-2">
              <Button
                type="button"
                onClick={capturePhoto}
                disabled={uploading}
                className="flex items-center space-x-2"
              >
                <Camera className="h-4 w-4" />
                <span>{uploading ? 'Uploading...' : 'Capture'}</span>
              </Button>
              <Button
                type="button"
                onClick={stopCamera}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
            </div>
          )}
        </div>

        {/* Camera View */}
        {isCapturing && (
          <div className="relative w-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-w-md mx-auto rounded-lg bg-black"
              style={{ maxHeight: '400px' }}
            />
            <canvas ref={canvasRef} className="hidden" />
            {/* Status indicator */}
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
              LIVE
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-slate-900 dark:text-slate-100">
              Captured Photos ({photos.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Case photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(photo, index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
