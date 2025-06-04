
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ConversationMessage {
  id: string;
  user_id: string;
  author_name: string;
  message: string;
  created_at: string;
  updated_at: string;
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
    if (!user || !mountedRef.current) {
      setMessages([]);
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    try {
      setHasConnectionError(false);
      
      // For now, we'll fetch all forum messages since we only have a global forum
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

  // Fetch messages when conversation changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!user || !mountedRef.current) {
      return;
    }

    const channel = supabase
      .channel('forum_messages_realtime')
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
            setMessages(prev => [...prev, payload.new as ConversationMessage]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'forum_messages'
        },
        (payload) => {
          if (!mountedRef.current) return;
          if (payload.new && typeof payload.new === 'object') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id ? payload.new as ConversationMessage : msg
              )
            );
          }
        }
      )
      .subscribe((status) => {
        if (mountedRef.current) {
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setHasConnectionError(true);
          } else if (status === 'SUBSCRIBED') {
            setHasConnectionError(false);
          }
        }
      });

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
    sendMessage
  };
};
