
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

interface ChatErrorStatesProps {
  type: 'conversations' | 'no-conversation';
  onRetry?: () => void;
}

const ChatErrorStates = ({ type, onRetry }: ChatErrorStatesProps) => {
  if (type === 'no-conversation') {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Welcome to the Repair Forum Chat!
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
            Select a conversation to start chatting
          </p>
        </div>
      </div>
    );
  }

  if (type === 'conversations') {
    return (
      <div className="px-4 py-2">
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700 dark:text-red-400 text-sm">
              Failed to load conversations. Please try refreshing.
            </p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="ml-2"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ChatErrorStates;
