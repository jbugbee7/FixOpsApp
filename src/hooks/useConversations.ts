
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
      console.log('No user, clearing conversations');
      setConversations([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Fetching conversations for user:', user.id);
      
      // First, get all conversations that the user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (memberError) {
        console.error('Error fetching conversation memberships:', memberError);
        throw memberError;
      }

      if (!memberData || memberData.length === 0) {
        console.log('User is not a member of any conversations');
        setConversations([]);
        setIsLoading(false);
        return;
      }

      const conversationIds = memberData.map(m => m.conversation_id);
      console.log('User is member of conversations:', conversationIds);

      // Now fetch the conversation details
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (conversationsError) {
        console.error('Error fetching conversations:', conversationsError);
        throw conversationsError;
      }

      console.log('Raw conversations fetched:', conversationsData?.length || 0);

      if (!conversationsData || conversationsData.length === 0) {
        console.log('No conversation details found');
        setConversations([]);
        setIsLoading(false);
        return;
      }

      // Get member counts and last messages for each conversation
      const conversationsWithMetadata = await Promise.all(
        conversationsData.map(async (conv) => {
          try {
            // Get member count using the safe function
            const { data: memberCountData, error: memberCountError } = await supabase
              .rpc('get_active_member_count', { conversation_id: conv.id });

            if (memberCountError) {
              console.error('Error getting member count for', conv.id, ':', memberCountError);
            }

            // Get last message
            const { data: lastMessage, error: lastMessageError } = await supabase
              .from('forum_messages')
              .select('message, created_at')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (lastMessageError) {
              console.error('Error getting last message for', conv.id, ':', lastMessageError);
            }

            return {
              ...conv,
              member_count: memberCountData || 0,
              last_message: lastMessage?.message || 'No messages yet',
              last_message_time: lastMessage?.created_at || conv.created_at,
              unread_count: 0 // We'll implement this later
            };
          } catch (error) {
            console.error('Error processing conversation metadata for', conv.id, ':', error);
            return {
              ...conv,
              member_count: 0,
              last_message: 'No messages yet',
              last_message_time: conv.created_at,
              unread_count: 0
            };
          }
        })
      );

      console.log('Conversations with metadata:', conversationsWithMetadata.length);
      setConversations(conversationsWithMetadata);
    } catch (error: any) {
      console.error('Error in fetchConversations:', error);
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
          // Refetch to update the list with proper filtering
          fetchConversations();
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
          // Refetch to update member counts and available conversations
          fetchConversations();
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
