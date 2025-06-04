
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
            {conversationsCount === 0 ? 'No conversations available' : 'Select a conversation to start chatting'}
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
