
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
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
        style={{
          paddingBottom: '80px',
          height: '100%'
        }}
      >
        {/* Messages */}
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
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
