
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Users, Shield, UserCog, MessageCircle } from 'lucide-react';

interface ChatHeaderProps {
  conversationName?: string;
  memberCount?: number;
  onToggleSidebar: () => void;
  showMenuButton: boolean;
}

const ChatHeader = ({ conversationName, memberCount, onToggleSidebar, showMenuButton }: ChatHeaderProps) => {
  const getConversationIcon = (name?: string) => {
    if (!name) return MessageCircle;
    if (name.toLowerCase().includes('general')) return Users;
    if (name.toLowerCase().includes('technician')) return Shield;
    if (name.toLowerCase().includes('manager')) return UserCog;
    return MessageCircle;
  };

  const IconComponent = getConversationIcon(conversationName);

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="flex items-center space-x-3">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {conversationName || 'Select a conversation'}
            </h1>
            {memberCount !== undefined && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {memberCount} {memberCount === 1 ? 'member' : 'members'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {!showMenuButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hidden md:flex"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default ChatHeader;
