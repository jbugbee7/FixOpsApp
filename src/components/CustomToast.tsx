
import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface CustomToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const CustomToast = ({ message, onClose, duration = 3000 }: CustomToastProps) => {
  useEffect(() => {
    console.log('CustomToast mounted, setting auto-dismiss timer for', duration, 'ms');
    
    const timer = setTimeout(() => {
      console.log('CustomToast auto-dismissing after', duration, 'ms');
      onClose();
    }, duration);

    // Cleanup function to clear timer if component unmounts
    return () => {
      console.log('CustomToast unmounting, clearing timer');
      clearTimeout(timer);
    };
  }, [onClose, duration]);

  const handleManualClose = () => {
    console.log('CustomToast manually closed');
    onClose();
  };

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[250px]">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={handleManualClose}
          className="ml-auto hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
