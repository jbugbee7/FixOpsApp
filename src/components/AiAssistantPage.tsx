import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, User } from 'lucide-react';
import AnimatedRepairBot from './AnimatedRepairBot';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Animated Robot Icon Component
const AnimatedRobotIcon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg
      viewBox="0 0 64 64"
      className="w-full h-full animate-pulse"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Robot Head */}
      <rect
        x="16"
        y="12"
        width="32"
        height="24"
        rx="4"
        className="fill-blue-500 stroke-blue-600 stroke-2"
      />
      
      {/* Robot Eyes */}
      <circle cx="24" cy="22" r="3" className="fill-white animate-bounce" style={{ animationDelay: '0s' }} />
      <circle cx="40" cy="22" r="3" className="fill-white animate-bounce" style={{ animationDelay: '0.1s' }} />
      <circle cx="24" cy="22" r="1.5" className="fill-blue-800" />
      <circle cx="40" cy="22" r="1.5" className="fill-blue-800" />
      
      {/* Robot Mouth */}
      <rect x="28" y="28" width="8" height="2" rx="1" className="fill-blue-800" />
      
      {/* Robot Body */}
      <rect
        x="20"
        y="36"
        width="24"
        height="20"
        rx="2"
        className="fill-blue-400 stroke-blue-500 stroke-2"
      />
      
      {/* Robot Arms */}
      <rect
        x="12"
        y="40"
        width="6"
        height="12"
        rx="3"
        className="fill-blue-400 stroke-blue-500 stroke-2 animate-pulse"
        style={{ animationDelay: '0.5s' }}
      />
      <rect
        x="46"
        y="40"
        width="6"
        height="12"
        rx="3"
        className="fill-blue-400 stroke-blue-500 stroke-2 animate-pulse"
        style={{ animationDelay: '0.7s' }}
      />
      
      {/* Robot Antenna */}
      <line x1="32" y1="12" x2="32" y2="8" className="stroke-blue-600 stroke-2" />
      <circle cx="32" cy="6" r="2" className="fill-blue-500 animate-ping" />
    </svg>
  </div>
);

const AiAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm FixBot, your AI repair assistant. I can help you with troubleshooting, part identification, and repair recommendations. What can I help you with today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      const isKeyboard = window.visualViewport ? 
        window.visualViewport.height < window.innerHeight * 0.75 : 
        false;
      setIsKeyboardVisible(isKeyboard);
    };

    const handleFocus = () => {
      setTimeout(() => {
        setIsKeyboardVisible(true);
        scrollToBottom();
      }, 300);
    };

    const handleBlur = () => {
      setTimeout(() => {
        setIsKeyboardVisible(false);
      }, 300);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand your concern. Let me help you with that. Based on your description, here are some troubleshooting steps you can try...",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header with new repair bot */}
      <div className="text-center mb-6">
        <AnimatedRepairBot className="h-16 w-16 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">FixBot</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">Get intelligent repair recommendations and troubleshooting help</p>
      </div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isKeyboardVisible ? 'pb-32' : 'pb-24'
        }`}
        style={{
          maxHeight: isKeyboardVisible ? 'calc(100vh - 280px)' : 'calc(100vh - 240px)',
          minHeight: '400px'
        }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user'
                      ? 'bg-blue-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <AnimatedRepairBot className="h-5 w-5" />
                  )}
                </div>
                <Card
                  className={`${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-slate-800 dark:border-slate-700'
                  }`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-blue-100'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input - Fixed at bottom */}
      <div 
        className={`fixed left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 ${
          isKeyboardVisible ? 'bottom-16 z-[60]' : 'bottom-16 z-[45]'
        }`}
      >
        <div className="max-w-4xl mx-auto flex space-x-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask FixBot about repairs, troubleshooting, or parts..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
