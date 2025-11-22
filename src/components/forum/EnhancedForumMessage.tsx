
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { ForumMessage as ForumMessageType } from '@/types/forumMessage';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedForumMessageProps {
  message: ForumMessageType;
}

const EnhancedForumMessage = ({ message }: EnhancedForumMessageProps) => {
  const { user, userProfile } = useAuth();
  const isOwnMessage = user?.id === message.user_id;
  
  // Use the user's full name for their own messages, fallback to the stored author_name
  const displayName = isOwnMessage 
    ? (userProfile?.full_name || user?.email || message.author_name)
    : message.author_name;

  return (
    <div className={`flex px-2 sm:px-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[80%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isOwnMessage ? 'bg-purple-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
          <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
        <Card className={`${isOwnMessage ? 'bg-purple-500 text-white border-purple-500' : 'bg-white dark:bg-slate-800 dark:border-slate-700'} shadow-sm`}>
          <CardContent className="p-2.5 sm:p-3">
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <p className={`text-xs sm:text-sm font-semibold truncate mr-2 ${isOwnMessage ? 'text-purple-100' : 'text-slate-900 dark:text-slate-100'}`}>
                {displayName}
              </p>
              <p className={`text-xs flex-shrink-0 ${isOwnMessage ? 'text-purple-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.message}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedForumMessage;
