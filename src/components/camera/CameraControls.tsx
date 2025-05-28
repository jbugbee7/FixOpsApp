
import { Button } from "@/components/ui/button";
import { Camera, X, RotateCcw } from 'lucide-react';

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
  if (!isCapturing) {
    return (
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={onStartCamera}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-medium shadow-lg transform transition-all duration-200 hover:scale-105"
          size="lg"
        >
          <Camera className="h-5 w-5 mr-2" />
          Start Camera
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-6 py-4">
      {/* Cancel button */}
      <Button
        type="button"
        onClick={onStopCamera}
        variant="outline"
        size="lg"
        className="rounded-full w-14 h-14 border-2 border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Capture button */}
      <div className="relative">
        <Button
          type="button"
          onClick={onCapturePhoto}
          disabled={uploading}
          className="rounded-full w-20 h-20 bg-white border-4 border-gray-300 hover:border-gray-400 shadow-lg transform transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:transform-none"
          size="lg"
        >
          <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center">
            {uploading ? (
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="w-12 h-12 bg-blue-600 rounded-full"></div>
            )}
          </div>
        </Button>
        {uploading && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
            Uploading...
          </div>
        )}
      </div>

      {/* Placeholder for balance (could add flip camera later) */}
      <div className="w-14 h-14 flex items-center justify-center">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="rounded-full w-14 h-14 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          disabled
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default CameraControls;
