
import { Globe } from 'lucide-react';

const PublicCaseBanner = () => {
  return (
    <div className="mb-6 p-4 bg-gun-metal/10 dark:bg-gun-metal/20 border border-gun-metal/20 rounded-lg">
      <div className="flex items-center gap-2 text-gun-metal dark:text-gun-metal">
        <Globe className="h-5 w-5" />
        <span className="font-medium">Public Work Order</span>
      </div>
      <p className="text-sm text-gun-metal/80 dark:text-gun-metal/80 mt-1">
        This is a public work order. Click "Edit" to claim ownership and move it to your cases.
      </p>
    </div>
  );
};

export default PublicCaseBanner;
