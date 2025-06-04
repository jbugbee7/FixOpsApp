
import React from 'react';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

interface ChatConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ChatConversationItem = ({ conversation, isSelected, onClick }: ChatConversationItemProps) => {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
        isSelected
          ? 'bg-blue-500 text-white shadow-md'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg">
            {conversation.avatar}
          </div>
          {conversation.online && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-medium text-sm truncate ${
              isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'
            }`}>
              {conversation.name}
            </h3>
            <span className={`text-xs ${
              isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
            }`}>
              {conversation.time}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <p className={`text-xs truncate ${
              isSelected ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'
            }`}>
              {conversation.lastMessage}
            </p>
            {conversation.unread > 0 && (
              <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                isSelected ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'
              }`}>
                {conversation.unread}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatConversationItem;
