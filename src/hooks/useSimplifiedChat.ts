
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
  const [isFetching, setIsFetching] = useState(true);
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

  // Fetch conversations - simplified to work with new RLS policies
  const fetchConversations = useCallback(async () => {
    if (!user || !mountedRef.current) {
      setConversations([]);
      setIsFetching(false);
      return;
    }

    try {
      setError(null);
      console.log('Fetching conversations for user:', user.id);
      
      // Direct fetch of conversations - RLS will handle filtering
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (conversationsError) {
        console.error('Error fetching conversations:', conversationsError);
        throw conversationsError;
      }

      if (!conversationsData || conversationsData.length === 0) {
        console.log('No conversations found');
        setConversations([]);
        setIsFetching(false);
        return;
      }

      // Get metadata for each conversation
      const conversationsWithMetadata = await Promise.all(
        conversationsData.map(async (conv) => {
          try {
            // Get member count using the safe function
            const { data: memberCountData } = await supabase
              .rpc('get_active_member_count', { conversation_id: conv.id });

            // Get last message
            const { data: lastMessage } = await supabase
              .from('forum_messages')
              .select('message, created_at')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            return {
              id: conv.id,
              name: conv.name,
              description: conv.description,
              member_count: memberCountData || 0,
              last_message: lastMessage?.message || 'No messages yet',
              last_message_time: lastMessage?.created_at || conv.created_at,
            };
          } catch (error) {
            console.error('Error processing conversation metadata:', error);
            return {
              id: conv.id,
              name: conv.name,
              description: conv.description,
              member_count: 0,
              last_message: 'No messages yet',
              last_message_time: conv.created_at,
            };
          }
        })
      );

      console.log('Conversations with metadata:', conversationsWithMetadata.length);
      setConversations(conversationsWithMetadata);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations');
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

    try {
      console.log('Fetching messages for conversation:', selectedConversation);
      const { data, error } = await supabase
        .from('forum_messages')
        .select('*')
        .eq('conversation_id', selectedConversation)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      console.log('Messages fetched:', data?.length || 0);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    }
  }, [user, selectedConversation]);

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || !userProfile || !selectedConversation || !mountedRef.current) {
      return;
    }

    setIsLoading(true);
    try {
      const authorName = userProfile.full_name || user.email || 'Unknown User';
      
      console.log('Sending message:', {
        user_id: user.id,
        author_name: authorName,
        message: inputMessage.trim(),
        conversation_id: selectedConversation
      });

      const { error } = await supabase
        .from('forum_messages')
        .insert({
          user_id: user.id,
          author_name: authorName,
          message: inputMessage.trim(),
          conversation_id: selectedConversation
        });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      if (mountedRef.current) {
        setInputMessage('');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      if (mountedRef.current) {
        toast({
          title: "Failed to Send Message",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation && !isFetching) {
      const generalConversation = conversations.find(c => 
        c.name.toLowerCase().includes('general')
      );
      const targetConversation = generalConversation?.id || conversations[0].id;
      console.log('Auto-selecting conversation:', targetConversation);
      setSelectedConversation(targetConversation);
    }
  }, [conversations, selectedConversation, isFetching]);

  // Fetch data on mount and user change
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user || !mountedRef.current) return;

    console.log('Setting up conversations real-time subscription');
    const conversationsChannel = supabase
      .channel('conversations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => {
        console.log('Conversation change detected:', payload);
        fetchConversations();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversation_members' }, (payload) => {
        console.log('Conversation members change detected:', payload);
        fetchConversations();
      })
      .subscribe();

    return () => {
      console.log('Cleaning up conversations subscription');
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, fetchConversations]);

  useEffect(() => {
    if (!user || !selectedConversation || !mountedRef.current) return;

    console.log('Setting up messages real-time subscription for:', selectedConversation);
    const messagesChannel = supabase
      .channel(`conversation_${selectedConversation}_messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_messages',
          filter: `conversation_id=eq.${selectedConversation}`
        },
        (payload) => {
          console.log('New message received:', payload);
          if (mountedRef.current && payload.new) {
            setMessages(prev => [...prev, payload.new as SimplifiedMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up messages subscription');
      supabase.removeChannel(messagesChannel);
    };
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
