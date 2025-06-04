
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Conversation {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  member_count?: number;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Fetching conversations for user:', user.id);
      
      // Fetch conversations with a simple query - RLS will handle the filtering
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }

      console.log('Fetched conversations:', data);

      // Get member counts and last messages for each conversation
      const conversationsWithMetadata = await Promise.all(
        (data || []).map(async (conv) => {
          // Get member count
          const { data: memberCountData, error: memberCountError } = await supabase
            .rpc('get_active_member_count', { conversation_id: conv.id });

          if (memberCountError) {
            console.error('Error getting member count for', conv.id, ':', memberCountError);
          }

          // Get last message
          const { data: lastMessage } = await supabase
            .from('forum_messages')
            .select('message, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            member_count: memberCountData || 0,
            last_message: lastMessage?.message || 'No messages yet',
            last_message_time: lastMessage?.created_at || conv.created_at,
            unread_count: 0 // We'll implement this later
          };
        })
      );

      setConversations(conversationsWithMetadata);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      setError(error.message || 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Set up real-time subscription for conversations
  useEffect(() => {
    if (!user) return;

    console.log('Setting up conversations real-time subscription');

    const channel = supabase
      .channel('conversations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          console.log('Conversation change detected:', payload);
          fetchConversations(); // Refetch to update the list
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversation_members'
        },
        (payload) => {
          console.log('Conversation members change detected:', payload);
          fetchConversations(); // Refetch to update member counts
        }
      )
      .subscribe((status) => {
        console.log('Conversations subscription status:', status);
      });

    return () => {
      console.log('Cleaning up conversations subscription');
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    refetch: fetchConversations
  };
};
