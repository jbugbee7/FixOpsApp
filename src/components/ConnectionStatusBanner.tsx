
import { WifiOff } from 'lucide-react';

interface ConnectionStatusBannerProps {
  isOnline: boolean;
  hasOfflineData: boolean;
}

const ConnectionStatusBanner = ({ isOnline, hasOfflineData }: ConnectionStatusBannerProps) => {
  if (isOnline) return null;

  return (
    <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <div className="flex items-center space-x-2">
        <WifiOff className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <span className="text-yellow-800 dark:text-yellow-200 font-medium">
          You're offline. Showing cached data.
        </span>
        {hasOfflineData && (
          <span className="text-yellow-600 dark:text-yellow-400 text-sm">
            (Use Resync to load cached data)
          </span>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatusBanner;
