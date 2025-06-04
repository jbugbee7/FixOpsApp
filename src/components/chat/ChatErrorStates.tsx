
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

interface ChatErrorStatesProps {
  conversationsError: any;
  onRetryConversations: () => void;
}

const ChatErrorStates = ({ conversationsError, onRetryConversations }: ChatErrorStatesProps) => {
  if (!conversationsError) return null;

  return (
    <div className="px-4 py-2">
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-red-700 dark:text-red-400 text-sm">
            Failed to load conversations. Please try refreshing.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetryConversations}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatErrorStates;
