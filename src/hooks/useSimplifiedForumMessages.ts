
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ForumMessage {
  id: string;
  user_id: string;
  author_name: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export const useSimplifiedForumMessages = () => {
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const mountedRef = useRef(true);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!user || !mountedRef.current || hasInitializedRef.current) {
      return;
    }

    setIsFetching(true);
    try {
      setHasConnectionError(false);
      
      const { data, error } = await supabase
        .from('forum_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50); // Limit to prevent performance issues

      if (!mountedRef.current) return;

      if (error) throw error;

      setMessages(data || []);
      hasInitializedRef.current = true;
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
  }, [user]);

  // Single initial fetch
  useEffect(() => {
    if (user && !hasInitializedRef.current) {
      fetchMessages();
    }
  }, [user, fetchMessages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || !userProfile || !mountedRef.current) {
      return;
    }

    setIsLoading(true);
    try {
      setHasConnectionError(false);
      const authorName = userProfile.full_name || user.email || 'Unknown User';
      
      const { error } = await supabase
        .from('forum_messages')
        .insert({
          user_id: user.id,
          author_name: authorName,
          message: inputMessage.trim()
        });

      if (error) throw error;

      if (mountedRef.current) {
        setInputMessage('');
        // Optimistically add message to local state
        const newMessage: ForumMessage = {
          id: Date.now().toString(), // Temporary ID
          user_id: user.id,
          author_name: authorName,
          message: inputMessage.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMessage]);
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
    sendMessage,
    fetchMessages
  };
};
