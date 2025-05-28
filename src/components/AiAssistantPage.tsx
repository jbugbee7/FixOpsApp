import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, User, Loader2, AlertTriangle } from 'lucide-react';
import AnimatedRepairBot from './AnimatedRepairBot';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";

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
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm FixBot, your intelligent AI repair assistant. I have access to your work orders, parts database, and appliance models to provide you with specific, data-driven repair recommendations. What can I help you troubleshoot today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasConnectionError, setHasConnectionError] = useState(false);
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setHasConnectionError(false);

    try {
      // Get the current session for auth
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Call the AI chat function
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: inputMessage },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Add AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error calling AI chat:', error);
      setHasConnectionError(true);
      
      let errorText = "I'm having trouble connecting to my intelligent systems right now. ";
      
      // Check for specific error types
      if (error.message?.includes('infinite recursion') || error.message?.includes('Failed to fetch')) {
        errorText += "This appears to be a temporary database configuration issue. Please try again in a few minutes.";
      } else if (error.message?.includes('Not authenticated')) {
        errorText += "Please make sure you're properly signed in and try again.";
      } else {
        errorText += "Please try again in a moment.";
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Only show toast for unexpected errors
      if (!error.message?.includes('infinite recursion') && !error.message?.includes('Failed to fetch')) {
        toast({
          title: "FixBot Error",
          description: "Failed to get AI response. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header with repair bot */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <AnimatedRepairBot className="h-8 w-8" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">FixBot</h2>
        </div>
        
        {/* Connection status indicator */}
        {hasConnectionError && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Connection issues detected - responses may be limited</span>
            </div>
          </div>
        )}
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
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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

      {/* Chat Input - Fixed positioning relative to viewport, not tabs */}
      <div 
        className={`fixed left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 z-[60] ${
          isKeyboardVisible ? 'bottom-0' : 'bottom-20'
        }`}
      >
        <div className="max-w-4xl mx-auto flex space-x-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={hasConnectionError 
              ? "AI features temporarily limited - basic responses only..." 
              : "Ask FixBot about repairs, parts, troubleshooting, or specific work orders..."
            }
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={isLoading || !inputMessage.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
