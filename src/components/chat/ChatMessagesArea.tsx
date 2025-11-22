
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import ForumMessage from '@/components/forum/ForumMessage';
import ChatLoadingIndicator from './ChatLoadingIndicator';
import ChatEmptyState from './ChatEmptyState';
import { ConversationMessage } from '@/hooks/useConversationMessages';

interface ChatMessagesAreaProps {
  messages: ConversationMessage[];
  isFetching: boolean;
  isLoading: boolean;
}

const ChatMessagesArea = ({ messages, isFetching, isLoading }: ChatMessagesAreaProps) => {
  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-4 pb-4">
        {isFetching ? (
          <ChatLoadingIndicator type="messages" />
        ) : messages.length === 0 ? (
          <ChatEmptyState type="no-messages" conversationsCount={0} />
        ) : (
          messages.map((message) => (
            <ForumMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && <ChatLoadingIndicator type="sending" />}
      </div>
    </ScrollArea>
  );
};

export default ChatMessagesArea;
