
import { AlertTriangle } from 'lucide-react';

interface ConnectionStatusProps {
  hasConnectionError: boolean;
}

const ConnectionStatus = ({ hasConnectionError }: ConnectionStatusProps) => {
  if (!hasConnectionError) return null;

  return (
    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="flex items-center justify-center space-x-2 text-yellow-800 dark:text-yellow-200">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm">Connection issues detected - forum may be limited</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
