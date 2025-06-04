
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Loader2 } from 'lucide-react';
import { useConversations } from '@/hooks/useConversations';
import ChatConversationItem from './ChatConversationItem';

interface ChatSidebarProps {
  selectedConversation?: string;
  onSelectConversation: (id: string) => void;
  isCollapsed?: boolean;
}

const ChatSidebar = ({ selectedConversation, onSelectConversation, isCollapsed }: ChatSidebarProps) => {
  const { conversations, isLoading, error } = useConversations();

  if (isCollapsed) {
    return (
      <div className="w-16 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col items-center py-4 space-y-4">
        {isLoading ? (
          <div className="w-10 h-10 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer text-lg transition-colors ${
                selectedConversation === conversation.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              onClick={() => onSelectConversation(conversation.id)}
              title={conversation.name}
            >
              {conversation.name.charAt(0)}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className="h-6 w-6 text-blue-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Repair Forum
          </h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              <span className="ml-2 text-slate-500">Loading conversations...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">Failed to load conversations</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No conversations available
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <ChatConversationItem
                key={conversation.id}
                conversation={{
                  id: conversation.id,
                  name: conversation.name,
                  lastMessage: conversation.last_message || 'No messages yet',
                  time: new Date(conversation.last_message_time || conversation.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  }),
                  unread: conversation.unread_count || 0,
                  avatar: conversation.name.charAt(0),
                  online: true // We'll implement proper online status later
                }}
                isSelected={selectedConversation === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
