import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface SimplifiedConversation {
  id: string;
  name: string;
  description: string;
  member_count: number;
  last_message: string;
  last_message_time: string;
}

export interface SimplifiedMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user_name?: string;
}

export const useSimplifiedChat = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<SimplifiedConversation[]>([]);
  const [messages, setMessages] = useState<SimplifiedMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const conversationList = (data || []).map(conv => ({
          id: conv.id,
          name: conv.name,
          description: '',
          member_count: 0,
          last_message: '',
          last_message_time: conv.updated_at || ''
        }));

        setConversations(conversationList);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId]);

  const fetchMessages = async (conversationId: string) => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setIsFetching(false);
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          content
        });

      if (error) throw error;

      await fetchMessages(conversationId);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const refetchConversations = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const conversationList = (data || []).map(conv => ({
        id: conv.id,
        name: conv.name,
        description: '',
        member_count: 0,
        last_message: '',
        last_message_time: conv.updated_at || ''
      }));

      setConversations(conversationList);
    } catch (error) {
      console.error('Error refetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    conversations,
    messages,
    selectedConversation,
    setSelectedConversation,
    inputMessage,
    setInputMessage,
    loading,
    isLoading,
    isFetching,
    error,
    fetchMessages,
    sendMessage,
    refetchConversations
  };
};
