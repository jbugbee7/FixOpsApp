
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Loader2, Users, Shield, UserCog, Plus } from 'lucide-react';
import { useConversations } from '@/hooks/useConversations';
import { useUserRole } from '@/hooks/useUserRole';
import ChatConversationItem from './ChatConversationItem';
import CreateConversationDialog from './CreateConversationDialog';

interface ChatSidebarProps {
  selectedConversation?: string;
  onSelectConversation: (id: string) => void;
  isCollapsed?: boolean;
}

const ChatSidebar = ({ selectedConversation, onSelectConversation, isCollapsed }: ChatSidebarProps) => {
  const { conversations, isLoading, error, refetch } = useConversations();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const getConversationIcon = (name: string) => {
    if (name.toLowerCase().includes('general')) return Users;
    if (name.toLowerCase().includes('technician')) return Shield;
    if (name.toLowerCase().includes('manager')) return UserCog;
    return MessageCircle;
  };

  const handleConversationCreated = () => {
    refetch();
  };

  if (isCollapsed) {
    return (
      <div className="w-16 border-r border-purple-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col items-center py-4 space-y-4">
        {isAdmin && !roleLoading && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCreateDialogOpen(true)}
            className="w-10 h-10 text-slate-600 dark:text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            title="Create Conversation"
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
        
        {isLoading ? (
          <div className="w-10 h-10 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
          </div>
        ) : (
          conversations.map((conversation) => {
            const IconComponent = getConversationIcon(conversation.name);
            return (
              <div
                key={conversation.id}
                className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  selectedConversation === conversation.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-100 dark:bg-slate-800 hover:bg-purple-200 dark:hover:bg-slate-700 text-purple-600 dark:text-slate-400'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
                title={conversation.name}
              >
                <IconComponent className="h-5 w-5" />
              </div>
            );
          })
        )}

        {isAdmin && (
          <CreateConversationDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onConversationCreated={handleConversationCreated}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-purple-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col">
      <div className="p-4 border-b border-purple-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Conversations
            </h2>
          </div>
          {isAdmin && !roleLoading && (
            <Button
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              className="h-8 px-3 text-xs bg-purple-500 hover:bg-purple-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-purple-50 dark:bg-slate-800 border-purple-200 dark:border-slate-700"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
              <span className="ml-2 text-slate-500">Loading conversations...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">Failed to load conversations</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No conversations available
              </p>
              {isAdmin && !roleLoading && (
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                  Create the first conversation to get started
                </p>
              )}
            </div>
          ) : (
            conversations.map((conversation) => {
              const IconComponent = getConversationIcon(conversation.name);
              return (
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
                    online: true,
                    icon: IconComponent
                  }}
                  isSelected={selectedConversation === conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                />
              );
            })
          )}
        </div>
      </ScrollArea>

      {isAdmin && (
        <CreateConversationDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onConversationCreated={handleConversationCreated}
        />
      )}
    </div>
  );
};

export default ChatSidebar;
