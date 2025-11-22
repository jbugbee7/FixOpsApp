
import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import { useAiChat } from '@/hooks/useAiChat';

const AiAssistantPage = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasConnectionError,
    handleSendMessage,
  } = useAiChat();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">AI Assistant</h2>
      </div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex flex-col flex-1 pb-32"
        style={{
          maxHeight: 'calc(100vh - 200px)',
          minHeight: '400px'
        }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
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
  );
};

export default AiAssistantPage;
