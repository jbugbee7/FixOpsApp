
import { useState, useEffect, useCallback } from 'react';
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

  // Memoize fetchMessages to prevent unnecessary re-renders
  const fetchMessages = useCallback(async () => {
    if (!user) {
      setIsFetching(false);
      return;
    }

    try {
      setHasConnectionError(false);
      console.log('Fetching forum messages...');
      
      const { data, error } = await supabase
        .from('forum_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('Fetched messages:', data);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setHasConnectionError(true);
      
      // Only show toast for non-network errors to avoid spam
      if (error && typeof error === 'object' && 'code' in error) {
        toast({
          title: "Connection Error",
          description: "Unable to load forum messages. Please check your connection.",
          variant: "destructive",
        });
      }
    } finally {
      setIsFetching(false);
    }
  }, [user, toast]);

  // Fetch initial messages
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Set up real-time subscription with better error handling
  useEffect(() => {
    if (!user) {
      console.log('No user, skipping real-time subscription');
      return;
    }

    console.log('Setting up real-time subscription for forum messages');

    const channel = supabase
      .channel('forum_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_messages'
        },
        (payload) => {
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
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'forum_messages'
        },
        (payload) => {
          console.log('Message deleted via real-time:', payload);
          if (payload.old && typeof payload.old === 'object' && 'id' in payload.old) {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
        if (status !== 'SUBSCRIBED') {
          console.error('Real-time subscription failed with status:', status);
          setHasConnectionError(true);
        }
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || !userProfile) {
      console.log('Cannot send message: missing input, user, or profile');
      return;
    }

    setIsLoading(true);
    try {
      setHasConnectionError(false);
      const authorName = userProfile.full_name || user.email || 'Unknown User';
      
      console.log('Sending message:', { user_id: user.id, author_name: authorName, message: inputMessage.trim() });
      
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

      setInputMessage('');
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      setHasConnectionError(true);
      toast({
        title: "Failed to Send Message",
        description: "Unable to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
