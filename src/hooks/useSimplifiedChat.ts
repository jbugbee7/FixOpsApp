import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SimplifiedConversation {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  last_message: string;
  last_message_time: string;
}

export interface SimplifiedMessage {
  id: string;
  user_id: string;
  author_name: string;
  message: string;
  created_at: string;
  updated_at: string;
  conversation_id: string;
}

export const useSimplifiedChat = () => {
  const [conversations, setConversations] = useState<SimplifiedConversation[]>([]);
  const [messages, setMessages] = useState<SimplifiedMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user || !mountedRef.current) {
      setConversations([]);
      setIsFetching(false);
      return;
    }

    try {
      setError(null);
      
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      if (!conversationsData || conversationsData.length === 0) {
        setConversations([]);
        setIsFetching(false);
        return;
      }

      // Add basic metadata (forum_messages table doesn't exist yet)
      const conversationsWithMetadata = conversationsData.map((conv) => ({
        id: conv.id,
        name: conv.name,
        description: null,
        member_count: 0,
        last_message: 'No messages yet',
        last_message_time: conv.created_at,
      }));

      setConversations(conversationsWithMetadata);
    } catch (error: any) {
      console.error('Failed to load conversations:', error);
      setError(error.message || 'Failed to load conversations');
    } finally {
      setIsFetching(false);
    }
  }, [user]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async () => {
    if (!user || !selectedConversation || !mountedRef.current) {
      setMessages([]);
      return;
    }

    // forum_messages table doesn't exist yet
    setMessages([]);
  }, [user, selectedConversation]);

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || !userProfile || !selectedConversation || !mountedRef.current) {
      return;
    }

    // forum_messages table doesn't exist yet
    toast({
      title: "Info",
      description: "Messaging not yet implemented",
    });
    setInputMessage('');
  };

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation && !isFetching) {
      const generalConversation = conversations.find(c => 
        c.name.toLowerCase().includes('general')
      );
      const targetConversation = generalConversation?.id || conversations[0].id;
      setSelectedConversation(targetConversation);
    }
  }, [conversations, selectedConversation, isFetching]);

  // Fetch data on mount and user change
  useEffect(() => {
    if (user) {
      fetchConversations();
    } else {
      setConversations([]);
      setSelectedConversation(null);
      setMessages([]);
      setIsFetching(false);
    }
  }, [fetchConversations, user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user || !mountedRef.current) return;

    const conversationsChannel = supabase
      .channel('conversations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => {
        fetchConversations();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversation_members' }, (payload) => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, fetchConversations]);

  // Skip messages subscription since table doesn't exist
  useEffect(() => {
    return () => {};
  }, [user, selectedConversation]);

  return {
    conversations,
    messages,
    selectedConversation,
    setSelectedConversation,
    inputMessage,
    setInputMessage,
    isLoading,
    isFetching,
    error,
    sendMessage,
    refetchConversations: fetchConversations
  };
};
