
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Fetch conversations where user is a member
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_members!inner(user_id)
        `)
        .eq('conversation_members.user_id', user.id)
        .order('updated_at', { ascending: false });

      if (conversationError) throw conversationError;

      // For each conversation, get member count and last message
      const conversationsWithDetails = await Promise.all(
        (conversationData || []).map(async (conv) => {
          // Get member count
          const { count: memberCount } = await supabase
            .from('conversation_members')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id);

          // Get last message
          const { data: lastMessage } = await supabase
            .from('forum_messages')
            .select('message, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...conv,
            member_count: memberCount || 0,
            last_message: lastMessage?.message || 'No messages yet',
            last_message_time: lastMessage?.created_at || conv.created_at,
            unread_count: 0 // TODO: Implement unread count logic
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Real-time subscription for conversation updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
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
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
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
