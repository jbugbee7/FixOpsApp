
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ConversationMessage {
  id: string;
  user_id: string;
  author_name: string;
  message: string;
  created_at: string;
  updated_at: string;
  conversation_id: string | null;
}

export const useConversationMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!user || !conversationId || !mountedRef.current) {
      setMessages([]);
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    try {
      setHasConnectionError(false);
      
      // Messages table doesn't exist yet, return empty array
      setMessages([]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (mountedRef.current) {
        setHasConnectionError(true);
      }
    } finally {
      if (mountedRef.current) {
        setIsFetching(false);
      }
    }
  }, [user, conversationId]);

  // Fetch messages when conversation changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!user || !conversationId || !mountedRef.current) {
      return;
    }

    // Messages table doesn't exist yet, skip real-time subscription
    return () => {};
  }, [user, conversationId]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || !userProfile || !conversationId || !mountedRef.current) {
      return;
    }

    setIsLoading(true);
    try {
      setHasConnectionError(false);
      
      // Messages table doesn't exist yet
      console.log('Messages table not implemented yet');
      
      if (mountedRef.current) {
        setInputMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (mountedRef.current) {
        setHasConnectionError(true);
        toast({
          title: "Failed to Send Message",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isFetching,
    hasConnectionError,
    sendMessage
  };
};
