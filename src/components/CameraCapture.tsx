
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { usePhotoCapture } from '@/hooks/usePhotoCapture';
import CameraControls from './camera/CameraControls';
import CameraView from './camera/CameraView';
import PhotoGallery from './camera/PhotoGallery';

interface CameraCaptureProps {
  onPhotosChange: (photos: string[]) => void;
  photos: string[];
}

const CameraCapture = ({ onPhotosChange, photos }: CameraCaptureProps) => {
  const { isCapturing, videoRef, canvasRef, startCamera, stopCamera } = useCamera();
  const { uploading, capturePhoto, removePhoto } = usePhotoCapture(photos, onPhotosChange);

  const handleCapturePhoto = () => {
    capturePhoto(videoRef, canvasRef, stopCamera);
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
        <CameraControls
          isCapturing={isCapturing}
          uploading={uploading}
          onStartCamera={startCamera}
          onCapturePhoto={handleCapturePhoto}
          onStopCamera={stopCamera}
        />

        <CameraView isCapturing={isCapturing} ref={videoRef} />
        <canvas ref={canvasRef} className="hidden" />

        <PhotoGallery photos={photos} onRemovePhoto={removePhoto} />
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
