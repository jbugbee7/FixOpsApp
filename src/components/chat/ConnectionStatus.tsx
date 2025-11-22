
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

  // Hide the connected message by returning null
  return null;
};

export default ConnectionStatus;
