
import { Button } from "@/components/ui/button";
import { Camera, X } from 'lucide-react';

interface CameraControlsProps {
  isCapturing: boolean;
  uploading: boolean;
  onStartCamera: () => void;
  onCapturePhoto: () => void;
  onStopCamera: () => void;
}

const CameraControls = ({ 
  isCapturing, 
  uploading, 
  onStartCamera, 
  onCapturePhoto, 
  onStopCamera 
}: CameraControlsProps) => {
  return (
    <div className="flex space-x-2">
      {!isCapturing ? (
        <Button
          type="button"
          onClick={onStartCamera}
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
            onClick={onCapturePhoto}
            disabled={uploading}
            className="flex items-center space-x-2"
          >
            <Camera className="h-4 w-4" />
            <span>{uploading ? 'Uploading...' : 'Capture'}</span>
          </Button>
          <Button
            type="button"
            onClick={onStopCamera}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraControls;
