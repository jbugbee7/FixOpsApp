
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import EnhancedForumMessage from '@/components/forum/EnhancedForumMessage';
import ChatLoadingIndicator from './ChatLoadingIndicator';
import ChatEmptyState from './ChatEmptyState';
import { ConversationMessage } from '@/hooks/useConversationMessages';
import { Case } from '@/types/case';

interface EnhancedChatMessagesAreaProps {
  messages: ConversationMessage[];
  workOrders?: Case[];
  onViewWorkOrder?: (workOrder: Case) => void;
  isFetching: boolean;
  hasConnectionError: boolean;
}

const EnhancedChatMessagesArea = ({ 
  messages, 
  workOrders = [], 
  onViewWorkOrder,
  isFetching, 
  hasConnectionError 
}: EnhancedChatMessagesAreaProps) => {
  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-4 pb-4">
        {isFetching ? (
          <ChatLoadingIndicator type="messages" />
        ) : messages.length === 0 ? (
          <ChatEmptyState type="no-messages" conversationsCount={0} />
        ) : (
          messages.map((message) => (
            <EnhancedForumMessage 
              key={message.id} 
              message={message}
              workOrders={workOrders}
              onViewWorkOrder={onViewWorkOrder}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default EnhancedChatMessagesArea;
