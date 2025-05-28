
import { forwardRef } from 'react';

interface CameraViewProps {
  isCapturing: boolean;
}

const CameraView = forwardRef<HTMLVideoElement, CameraViewProps>(
  ({ isCapturing }, videoRef) => {
    if (!isCapturing) {
      return (
        <div className="relative w-full h-80 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Camera ready to start</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full">
        <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Live indicator */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded-full">
              LIVE
            </span>
          </div>

          {/* Camera overlay grid */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border border-white/20 rounded-xl">
              <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/10"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Corner focus indicators */}
          <div className="absolute top-4 right-4 w-6 h-6">
            <div className="border-t-2 border-r-2 border-white/60 w-full h-full rounded-tr-lg"></div>
          </div>
          <div className="absolute bottom-4 left-4 w-6 h-6">
            <div className="border-b-2 border-l-2 border-white/60 w-full h-full rounded-bl-lg"></div>
          </div>
          <div className="absolute bottom-4 right-4 w-6 h-6">
            <div className="border-b-2 border-r-2 border-white/60 w-full h-full rounded-br-lg"></div>
          </div>
        </div>
      </div>
    );
  }
);

CameraView.displayName = 'CameraView';

export default CameraView;
