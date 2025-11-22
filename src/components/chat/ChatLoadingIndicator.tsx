
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ChatLoadingIndicatorProps {
  type: 'conversations' | 'messages' | 'sending';
}

const ChatLoadingIndicator = ({ type }: ChatLoadingIndicatorProps) => {
  if (type === 'conversations') {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-slate-400 mx-auto mb-4 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400">
            Loading conversations...
          </p>
        </div>
      </div>
    );
  }

  if (type === 'messages') {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 text-slate-400 mx-auto mb-4 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400">
          Loading messages...
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2 max-w-xs">
        <div className="flex items-center space-x-2">
          <div className="animate-pulse flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-slate-500">Sending...</span>
        </div>
      </div>
    </div>
  );
};

export default ChatLoadingIndicator;
