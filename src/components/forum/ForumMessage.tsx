
import { User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { ForumMessage as ForumMessageType } from '@/hooks/useForumMessages';
import { useAuth } from '@/contexts/AuthContext';

interface ForumMessageProps {
  message: ForumMessageType;
}

const ForumMessage = ({ message }: ForumMessageProps) => {
  const { user } = useAuth();
  const isOwnMessage = user?.id === message.user_id;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOwnMessage ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
          <User className="h-4 w-4 text-white" />
        </div>
        <Card className={`${isOwnMessage ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-slate-800 dark:border-slate-700'}`}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <p className={`text-sm font-semibold ${isOwnMessage ? 'text-blue-100' : 'text-slate-900 dark:text-slate-100'}`}>
                {message.author_name}
              </p>
              <p className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForumMessage;
