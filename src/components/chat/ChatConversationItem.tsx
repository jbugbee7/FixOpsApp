
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ChatConversationItemProps {
  conversation: {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    avatar: string;
    online: boolean;
    icon?: React.ComponentType<{ className?: string }>;
  };
  isSelected: boolean;
  onClick: () => void;
}

const ChatConversationItem = ({ conversation, isSelected, onClick }: ChatConversationItemProps) => {
  const IconComponent = conversation.icon;

  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
      onClick={onClick}
    >
      {/* Avatar with icon or first letter */}
      <div className="relative flex-shrink-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
          isSelected ? 'bg-blue-500' : 'bg-slate-400'
        }`}>
          {IconComponent ? (
            <IconComponent className="h-6 w-6" />
          ) : (
            conversation.avatar
          )}
        </div>
        {conversation.online && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
        )}
      </div>

      {/* Conversation info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-medium truncate ${
            isSelected 
              ? 'text-blue-900 dark:text-blue-100' 
              : 'text-slate-900 dark:text-slate-100'
          }`}>
            {conversation.name}
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
            {conversation.time}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
            {conversation.lastMessage}
          </p>
          {conversation.unread > 0 && (
            <Badge variant="destructive" className="ml-2 text-xs px-2 py-0">
              {conversation.unread}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatConversationItem;
