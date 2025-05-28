
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import AnimatedRepairBot from './AnimatedRepairBot';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import ConnectionStatus from './chat/ConnectionStatus';
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
      {/* Header with repair bot */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <AnimatedRepairBot className="h-8 w-8" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">FixBot</h2>
        </div>
        
        <ConnectionStatus hasConnectionError={hasConnectionError} />
      </div>

      {/* Chat Container - now with bottom padding to account for input */}
      <div 
        ref={chatContainerRef}
        className="flex flex-col flex-1 pb-32"
        style={{
          maxHeight: 'calc(100vh - 240px)',
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
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                  <AnimatedRepairBot className="h-5 w-5" />
                </div>
                <Card className="bg-white dark:bg-slate-800 dark:border-slate-700">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">FixBot is thinking...</p>
                    </div>
                  </CardContent>
                </Card>
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
