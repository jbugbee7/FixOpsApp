
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw } from 'lucide-react';

interface ErrorStateCardProps {
  errorMessage: string;
  onRetry: () => void;
  refreshing: boolean;
}

const ErrorStateCard = ({ errorMessage, onRetry, refreshing }: ErrorStateCardProps) => {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardContent className="text-center py-12">
        <Database className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Data Access Issue
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {errorMessage || 'Unable to access your repair data at this time.'}
        </p>
        <div className="space-y-2 text-sm text-slate-500 dark:text-slate-500 mb-4">
          <p>This could be due to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Database connectivity issues</li>
            <li>Authentication problems</li>
            <li>Row-level security policies</li>
          </ul>
        </div>
        <Button onClick={onRetry} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorStateCard;
