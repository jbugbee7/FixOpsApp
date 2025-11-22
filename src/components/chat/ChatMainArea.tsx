
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ConnectionStatus from '@/components/chat/ConnectionStatus';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatErrorStates from './ChatErrorStates';
import ChatLoadingIndicator from './ChatLoadingIndicator';
import ChatEmptyState from './ChatEmptyState';
import ChatMessagesArea from './ChatMessagesArea';
import ChatInputArea from './ChatInputArea';
import { Conversation } from '@/hooks/useConversations';
import { ConversationMessage } from '@/hooks/useConversationMessages';

interface ChatMainAreaProps {
  currentConversation: Conversation | undefined;
  selectedConversation: string | null;
  conversationsLoading: boolean;
  conversationsError: any;
  conversations: Conversation[];
  messages: ConversationMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  hasConnectionError: boolean;
  sendMessage: () => void;
  onToggleSidebar: () => void;
  showMenuButton: boolean;
  onRetryConversations: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  getPlaceholderText: () => string;
}

const ChatMainArea = ({
  currentConversation,
  selectedConversation,
  conversationsLoading,
  conversationsError,
  conversations,
  messages,
  inputMessage,
  setInputMessage,
  isLoading,
  isFetching,
  hasConnectionError,
  sendMessage,
  onToggleSidebar,
  showMenuButton,
  onRetryConversations,
  handleKeyPress,
  getPlaceholderText
}: ChatMainAreaProps) => {
  return (
    <>
      <ChatHeader 
        conversationName={currentConversation?.name || 'Repair Forum'}
        memberCount={currentConversation?.member_count}
        onToggleSidebar={onToggleSidebar}
        showMenuButton={showMenuButton}
      />
      
      <Card className="flex-1 flex flex-col border-0 rounded-none bg-white dark:bg-slate-900">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Connection Status */}
          <div className="px-4 py-2">
            <ConnectionStatus hasConnectionError={hasConnectionError} />
          </div>

          {/* Error State for Conversations */}
          {conversationsError && (
            <ChatErrorStates 
              type="conversations"
              onRetry={onRetryConversations}
            />
          )}
          
          {conversationsLoading ? (
            <ChatLoadingIndicator type="conversations" />
          ) : !selectedConversation && conversations.length === 0 ? (
            <ChatEmptyState type="no-conversation" conversationsCount={conversations.length} />
          ) : (
            <>
              <ChatMessagesArea
                messages={messages}
                isFetching={isFetching}
                isLoading={isLoading}
              />
              
              <ChatInputArea
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                onSendMessage={sendMessage}
                isLoading={isLoading}
                placeholder={getPlaceholderText()}
                onKeyPress={handleKeyPress}
              />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ChatMainArea;
