
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Users, Shield } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import ConversationMembersDialog from './ConversationMembersDialog';

interface ChatHeaderProps {
  conversationName?: string;
  conversationId?: string;
  memberCount?: number;
  onToggleSidebar: () => void;
  showMenuButton: boolean;
}

const ChatHeader = ({ 
  conversationName, 
  conversationId,
  memberCount, 
  onToggleSidebar, 
  showMenuButton 
}: ChatHeaderProps) => {
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const { isAdmin } = useUserRole();

  return (
    <div className="h-16 border-b border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 flex items-center justify-between px-4">
      <div className="flex items-center space-x-3">
        {showMenuButton && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {conversationName || 'Repair Forum'}
          </h1>
          {isAdmin && (
            <Badge variant="secondary" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          )}
        </div>
      </div>
      
      {conversationId && memberCount !== undefined && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMembersDialogOpen(true)}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <Users className="h-4 w-4 mr-2" />
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </Button>
      )}

      {conversationId && (
        <ConversationMembersDialog
          open={membersDialogOpen}
          onOpenChange={setMembersDialogOpen}
          conversationId={conversationId}
          conversationName={conversationName || 'Conversation'}
        />
      )}
    </div>
  );
};

export default ChatHeader;
