
import { forwardRef } from 'react';

interface CameraViewProps {
  isCapturing: boolean;
}

const CameraView = forwardRef<HTMLVideoElement, CameraViewProps>(
  ({ isCapturing }, videoRef) => {
    if (!isCapturing) return null;

    return (
      <div className="relative w-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-md mx-auto rounded-lg bg-black"
          style={{ maxHeight: '400px' }}
        />
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
          LIVE
        </div>
      </div>
    );
  }
);

CameraView.displayName = 'CameraView';

export default CameraView;
