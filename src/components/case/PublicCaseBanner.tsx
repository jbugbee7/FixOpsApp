
import { Globe } from 'lucide-react';

const PublicCaseBanner = () => {
  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <Globe className="h-5 w-5" />
        <span className="font-medium">Public Work Order</span>
      </div>
      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
        This is a public work order. Click "Edit" to claim ownership and move it to your cases.
      </p>
    </div>
  );
};

export default PublicCaseBanner;
