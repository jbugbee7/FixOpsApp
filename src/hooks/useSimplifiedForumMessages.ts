
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ForumMessage } from '@/types/forumMessage';

export const useSimplifiedForumMessages = (conversationId: string | null) => {
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
    if (!user || !conversationId || !mountedRef.current || hasInitializedRef.current) {
      return;
    }

    setIsFetching(true);
    try {
      setHasConnectionError(false);
      
      const { data, error } = await supabase
        .from('forum_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(100);

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
  }, [user, conversationId]);

  // Reset when conversation changes
  useEffect(() => {
    hasInitializedRef.current = false;
    setMessages([]);
  }, [conversationId]);

  // Single initial fetch
  useEffect(() => {
    if (user && conversationId && !hasInitializedRef.current) {
      fetchMessages();
    }
  }, [user, conversationId, fetchMessages]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !conversationId || !hasInitializedRef.current) return;

    const channel = supabase
      .channel(`forum_messages_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          if (mountedRef.current && payload.new) {
            const newMessage = payload.new as ForumMessage;
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationId, hasInitializedRef.current]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || !userProfile || !conversationId || !mountedRef.current) {
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
          message: inputMessage.trim(),
          conversation_id: conversationId
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
