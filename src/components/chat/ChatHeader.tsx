
import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical, Users, Menu } from 'lucide-react';

interface ChatHeaderProps {
  conversationName: string;
  memberCount?: number;
  onToggleSidebar?: () => void;
  showMenuButton?: boolean;
}

const ChatHeader = ({ conversationName, memberCount, onToggleSidebar, showMenuButton }: ChatHeaderProps) => {
  return (
    <div className="h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between px-4">
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
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-semibold">
            {conversationName.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              {conversationName}
            </h2>
            {memberCount && (
              <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                <Users className="h-3 w-3" />
                <span>{memberCount} members</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
