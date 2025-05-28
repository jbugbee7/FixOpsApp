
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

export const useForumMessages = () => {
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const mountedRef = useRef(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Optimized fetchMessages with better error handling
  const fetchMessages = useCallback(async () => {
    if (!user || fetchingRef.current || !mountedRef.current) {
      if (mountedRef.current) setIsFetching(false);
      return;
    }

    fetchingRef.current = true;
    try {
      setHasConnectionError(false);
      console.log('Fetching forum messages optimized...');
      
      const { data, error } = await supabase
        .from('forum_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (!mountedRef.current) return;

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('Fetched messages:', data?.length || 0);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (mountedRef.current) {
        setHasConnectionError(true);
        
        // Only show toast for non-network errors
        if (error && typeof error === 'object' && 'code' in error) {
          toast({
            title: "Connection Error",
            description: "Unable to load messages.",
            variant: "destructive",
          });
        }
      }
    } finally {
      if (mountedRef.current) {
        setIsFetching(false);
        fetchingRef.current = false;
      }
    }
  }, [user, toast]);

  // Fetch initial messages
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Optimized real-time subscription
  useEffect(() => {
    if (!user || !mountedRef.current) {
      console.log('No user, skipping forum real-time subscription');
      return;
    }

    console.log('Setting up optimized forum real-time subscription');

    const channel = supabase
      .channel('forum_messages_optimized')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_messages'
        },
        (payload) => {
          if (!mountedRef.current) return;
          console.log('New message received via real-time:', payload);
          if (payload.new && typeof payload.new === 'object') {
            setMessages(prev => [...prev, payload.new as ForumMessage]);
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
          console.log('Message updated via real-time:', payload);
          if (payload.new && typeof payload.new === 'object') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id ? payload.new as ForumMessage : msg
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Forum real-time subscription status:', status);
        if (status !== 'SUBSCRIBED' && mountedRef.current) {
          setHasConnectionError(true);
        }
      });

    return () => {
      console.log('Cleaning up forum real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || !userProfile || !mountedRef.current) {
      console.log('Cannot send message: missing requirements');
      return;
    }

    setIsLoading(true);
    try {
      setHasConnectionError(false);
      const authorName = userProfile.full_name || user.email || 'Unknown User';
      
      console.log('Sending optimized message:', { user_id: user.id, author_name: authorName });
      
      const { error } = await supabase
        .from('forum_messages')
        .insert({
          user_id: user.id,
          author_name: authorName,
          message: inputMessage.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      if (mountedRef.current) {
        setInputMessage('');
        console.log('Message sent successfully');
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
