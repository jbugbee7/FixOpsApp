
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

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user || !mountedRef.current) {
      setConversations([]);
      setIsFetching(false);
      return;
    }

    try {
      setError(null);
      console.log('Fetching conversations for user:', user.id);
      
      // Get conversations user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      if (!memberData || memberData.length === 0) {
        setConversations([]);
        setIsFetching(false);
        return;
      }

      const conversationIds = memberData.map(m => m.conversation_id);

      // Fetch conversation details
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      if (!conversationsData) {
        setConversations([]);
        setIsFetching(false);
        return;
      }

      // Get metadata for each conversation
      const conversationsWithMetadata = await Promise.all(
        conversationsData.map(async (conv) => {
          try {
            // Get member count
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
      const { data, error } = await supabase
        .from('forum_messages')
        .select('*')
        .eq('conversation_id', selectedConversation)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
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
      
      const { error } = await supabase
        .from('forum_messages')
        .insert({
          user_id: user.id,
          author_name: authorName,
          message: inputMessage.trim(),
          conversation_id: selectedConversation
        });

      if (error) throw error;

      if (mountedRef.current) {
        setInputMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (mountedRef.current) {
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
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user || !mountedRef.current) return;

    const conversationsChannel = supabase
      .channel('conversations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        fetchConversations();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversation_members' }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, fetchConversations]);

  useEffect(() => {
    if (!user || !selectedConversation || !mountedRef.current) return;

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
          if (mountedRef.current && payload.new) {
            setMessages(prev => [...prev, payload.new as SimplifiedMessage]);
          }
        }
      )
      .subscribe();

    return () => {
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
