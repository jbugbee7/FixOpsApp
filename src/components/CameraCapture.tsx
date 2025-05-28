
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
    <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
          <Camera className="h-5 w-5 text-blue-600" />
          <span>Camera</span>
        </CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Capture photos to document the case
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Camera View */}
        <CameraView isCapturing={isCapturing} ref={videoRef} />
        
        {/* Camera Controls */}
        <CameraControls
          isCapturing={isCapturing}
          uploading={uploading}
          onStartCamera={startCamera}
          onCapturePhoto={handleCapturePhoto}
          onStopCamera={stopCamera}
        />

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Photo Gallery */}
        <PhotoGallery photos={photos} onRemovePhoto={removePhoto} />
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
