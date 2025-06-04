
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle } from 'lucide-react';
import ChatConversationItem from './ChatConversationItem';

interface ChatSidebarProps {
  selectedConversation?: string;
  onSelectConversation: (id: string) => void;
  isCollapsed?: boolean;
}

const ChatSidebar = ({ selectedConversation, onSelectConversation, isCollapsed }: ChatSidebarProps) => {
  // Mock conversation data - replace with real data
  const conversations = [
    {
      id: '1',
      name: 'General Discussion',
      lastMessage: 'Thanks for the help with the repair!',
      time: '2:34 PM',
      unread: 2,
      avatar: '👥',
      online: true
    },
    {
      id: '2',
      name: 'Parts & Troubleshooting',
      lastMessage: 'Anyone know where to find this part?',
      time: '1:22 PM',
      unread: 0,
      avatar: '🔧',
      online: false
    },
    {
      id: '3',
      name: 'Repair Tips',
      lastMessage: 'Just fixed a similar issue yesterday',
      time: '12:45 PM',
      unread: 5,
      avatar: '💡',
      online: true
    },
    {
      id: '4',
      name: 'Customer Service',
      lastMessage: 'Customer was very satisfied with the work',
      time: '11:30 AM',
      unread: 0,
      avatar: '📞',
      online: false
    }
  ];

  if (isCollapsed) {
    return (
      <div className="w-16 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col items-center py-4 space-y-4">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer text-lg transition-colors ${
              selectedConversation === conversation.id
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            {conversation.avatar}
          </div>
        ))}
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
          {conversations.map((conversation) => (
            <ChatConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversation === conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
