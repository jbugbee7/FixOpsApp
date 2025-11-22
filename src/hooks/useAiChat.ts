
import { useState } from 'react';
import { Message } from '@/types/chat';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

export const useAiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasConnectionError, setHasConnectionError] = useState(false);

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
      
      let errorText = "Connection issue. Please try again.";
      
      // Check for specific error types
      if (error.message?.includes('infinite recursion') || error.message?.includes('Failed to fetch')) {
        errorText = "Temporary issue. Try again in a moment.";
      } else if (error.message?.includes('Not authenticated')) {
        errorText = "Please sign in and try again.";
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
          title: "Error",
          description: "Failed to get response. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasConnectionError,
    handleSendMessage,
  };
};
