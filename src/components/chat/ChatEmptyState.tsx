
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatEmptyStateProps {
  type: 'no-conversation' | 'no-messages';
  conversationsCount: number;
}

const ChatEmptyState = ({ type, conversationsCount }: ChatEmptyStateProps) => {
  if (type === 'no-conversation') {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            Welcome to the Repair Forum Chat!
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
            Start a conversation with fellow technicians
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
      <p className="text-slate-500 dark:text-slate-400">
        No messages yet. Be the first to start the conversation!
      </p>
    </div>
  );
};

export default ChatEmptyState;
