
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  hasConnectionError: boolean;
}

const ConnectionStatus = ({ hasConnectionError }: ConnectionStatusProps) => {
  if (hasConnectionError) {
    return (
      <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="text-red-700 dark:text-red-400">
          Connection lost. Messages may not sync properly. Check your internet connection.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-700 dark:text-green-400">
        Connected to repair forum
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatus;
