
import React from 'react';
import ChatHeader from './ChatHeader';
import EnhancedChatMessagesArea from './EnhancedChatMessagesArea';
import ChatInputArea from './ChatInputArea';
import ChatErrorStates from './ChatErrorStates';
import { Conversation } from '@/hooks/useConversations';
import { ConversationMessage } from '@/hooks/useConversationMessages';
import { Case } from '@/types/case';

interface EnhancedChatMainAreaProps {
  currentConversation?: Conversation;
  selectedConversation: string | null;
  conversationsLoading: boolean;
  conversationsError: string | null;
  conversations: Conversation[];
  messages: ConversationMessage[];
  workOrders: Case[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  hasConnectionError: boolean;
  sendMessage: () => void;
  onToggleSidebar: () => void;
  onViewWorkOrder: (workOrder: Case) => void;
  showMenuButton: boolean;
  onRetryConversations: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  getPlaceholderText: () => string;
}

const EnhancedChatMainArea = ({
  currentConversation,
  selectedConversation,
  conversationsLoading,
  conversationsError,
  conversations,
  messages,
  workOrders,
  inputMessage,
  setInputMessage,
  isLoading,
  isFetching,
  hasConnectionError,
  sendMessage,
  onToggleSidebar,
  onViewWorkOrder,
  showMenuButton,
  onRetryConversations,
  handleKeyPress,
  getPlaceholderText
}: EnhancedChatMainAreaProps) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader
        conversationName={currentConversation?.name}
        conversationId={currentConversation?.id}
        memberCount={currentConversation?.member_count}
        onToggleSidebar={onToggleSidebar}
        showMenuButton={showMenuButton}
      />

      {conversationsError ? (
        <ChatErrorStates
          type="conversations"
          onRetry={onRetryConversations}
        />
      ) : !selectedConversation ? (
        <ChatErrorStates type="no-conversation" />
      ) : (
        <>
          <EnhancedChatMessagesArea
            messages={messages}
            workOrders={workOrders}
            onViewWorkOrder={onViewWorkOrder}
            isFetching={isFetching}
            hasConnectionError={hasConnectionError}
          />

          <ChatInputArea
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={sendMessage}
            onKeyPress={handleKeyPress}
            isLoading={isLoading}
            placeholder={getPlaceholderText()}
          />
        </>
      )}
    </div>
  );
};

export default EnhancedChatMainArea;
