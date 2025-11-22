
import { Globe } from 'lucide-react';

const PublicCaseBanner = () => {
  return (
    <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
      <div className="flex items-center gap-2 text-primary">
        <Globe className="h-5 w-5" />
        <span className="font-medium">Public Work Order</span>
      </div>
      <p className="text-sm text-primary/80 mt-1">
        This is a public work order. Click "Edit" to claim ownership and move it to your cases.
      </p>
    </div>
  );
};

export default PublicCaseBanner;
