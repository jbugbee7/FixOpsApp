
import { useState, useRef, useEffect } from 'react';
import { Loader2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import { useAiChat } from '@/hooks/useAiChat';
import { useAiConversations } from '@/hooks/useAiConversations';
import AiChatSidebar from './chat/AiChatSidebar';
import { useIsMobile, useViewport } from '@/hooks/use-mobile';

const AiAssistantPage = () => {
  const isMobile = useIsMobile();
  const { height: viewportHeight } = useViewport();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    deleteConversation,
    getCurrentMessages,
    setConversationMessages
  } = useAiConversations();

  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasConnectionError,
    handleSendMessage,
    setMessages
  } = useAiChat();

  // Sync messages from current conversation to useAiChat when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      const currentMessages = getCurrentMessages();
      setMessages(currentMessages);
    }
  }, [currentConversationId]);

  // Sync messages back to conversation when they change in useAiChat
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      setConversationMessages(currentConversationId, messages);
    }
  }, [messages, currentConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isKeyboardVisible && isMobile) {
      scrollToBottom();
    }
  }, [isKeyboardVisible, isMobile]);

  const handleNewConversation = () => {
    createNewConversation();
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    setSidebarOpen(false);
  };

  return (
    <div 
      className="flex overflow-hidden"
      style={{ 
        height: isMobile ? `${viewportHeight}px` : '100vh',
        maxHeight: isMobile ? `${viewportHeight}px` : '100vh'
      }}
    >
      {/* Sidebar - Mobile Only */}
      {isMobile && (
        <AiChatSidebar
          conversations={conversations}
          selectedConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={deleteConversation}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Header with Menu Button - Mobile Only */}
        {isMobile && (
          <div className="flex items-center gap-2 p-3 border-b border-border bg-background flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-sm font-medium">AI Assistant</h2>
          </div>
        )}

        {/* Chat Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
        >
          {/* Messages */}
          <div className="space-y-4 p-4 pb-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg mb-2">Start a conversation</p>
                  <p className="text-sm">Ask me anything!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div ref={inputContainerRef} className="flex-shrink-0">
          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            hasConnectionError={hasConnectionError}
            isKeyboardVisible={isKeyboardVisible}
            setIsKeyboardVisible={setIsKeyboardVisible}
            onScrollToBottom={scrollToBottom}
          />
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
