
import { useState, useRef } from 'react';
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !user) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      setUploading(true);
      try {
        const fileName = `${user.id}/${Date.now()}.jpg`;
        
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

        // Get public URL for the uploaded photo
        const { data: { publicUrl } } = supabase.storage
          .from('case-photos')
          .getPublicUrl(fileName);

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
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-md mx-auto rounded-lg"
            />
            <canvas ref={canvasRef} className="hidden" />
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
