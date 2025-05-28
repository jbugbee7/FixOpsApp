
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

export const usePhotoCapture = (
  photos: string[],
  onPhotosChange: (photos: string[]) => void
) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const capturePhoto = async (
    videoRef: React.RefObject<HTMLVideoElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    stopCamera: () => void
  ) => {
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

  return {
    uploading,
    capturePhoto,
    removePhoto
  };
};
