
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
  const [isFetching, setIsFetching] = useState(true);
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
    if (!user || !mountedRef.current) {
      if (mountedRef.current) setIsFetching(false);
      return;
    }

    try {
      setHasConnectionError(false);
      
      const { data, error } = await supabase
        .from('forum_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (!mountedRef.current) return;

      if (error) throw error;

      setMessages(data || []);
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

  // Initial fetch only
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Simplified real-time subscription
  useEffect(() => {
    if (!user || !mountedRef.current) return;

    const channel = supabase
      .channel('forum_messages_simple')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_messages'
        },
        (payload) => {
          if (!mountedRef.current) return;
          if (payload.new && typeof payload.new === 'object') {
            setMessages(prev => [...prev, payload.new as ForumMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

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
