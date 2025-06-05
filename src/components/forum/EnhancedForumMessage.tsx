
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { ForumMessage as ForumMessageType } from '@/types/forumMessage';
import { useAuth } from '@/contexts/AuthContext';
import { Case } from '@/types/case';
import WorkOrderReference from '@/components/chat/WorkOrderReference';

interface EnhancedForumMessageProps {
  message: ForumMessageType;
  workOrders?: Case[];
  onViewWorkOrder?: (workOrder: Case) => void;
}

const EnhancedForumMessage = ({ message, workOrders = [], onViewWorkOrder }: EnhancedForumMessageProps) => {
  const { user, userProfile } = useAuth();
  const isOwnMessage = user?.id === message.user_id;
  
  // Use the user's full name for their own messages, fallback to the stored author_name
  const displayName = isOwnMessage 
    ? (userProfile?.full_name || user?.email || message.author_name)
    : message.author_name;

  // Function to parse work order references from message text
  const parseWorkOrderReferences = (text: string) => {
    const woPattern = /WO-(\d+)/gi;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = woPattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Find the work order
      const woNumber = match[0];
      const foundWorkOrder = workOrders.find(wo => 
        wo.wo_number === woNumber || 
        `WO-${wo.id.slice(0, 8)}` === woNumber
      );

      if (foundWorkOrder) {
        parts.push({
          type: 'workorder',
          content: woNumber,
          workOrder: foundWorkOrder
        });
      } else {
        parts.push({
          type: 'text',
          content: woNumber
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  const messageParts = parseWorkOrderReferences(message.message);

  return (
    <div className={`flex px-2 sm:px-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[80%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isOwnMessage ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
          <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
        <Card className={`${isOwnMessage ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-slate-800 dark:border-slate-700'} shadow-sm`}>
          <CardContent className="p-2.5 sm:p-3">
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <p className={`text-xs sm:text-sm font-semibold truncate mr-2 ${isOwnMessage ? 'text-blue-100' : 'text-slate-900 dark:text-slate-100'}`}>
                {displayName}
              </p>
              <p className={`text-xs flex-shrink-0 ${isOwnMessage ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {messageParts.map((part, index) => {
                if (part.type === 'workorder' && part.workOrder && onViewWorkOrder) {
                  return (
                    <div key={index} className="my-2">
                      <WorkOrderReference 
                        workOrder={part.workOrder} 
                        onViewDetails={onViewWorkOrder}
                      />
                    </div>
                  );
                }
                return <span key={index}>{part.content}</span>;
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedForumMessage;
