
import { useState, useEffect, useCallback } from 'react';
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
      
      // For now, we'll return a mock global conversation since we only have a forum system
      const mockConversation: Conversation = {
        id: 'global-forum',
        name: 'Repair Forum',
        description: 'Global chat for repair technicians',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        member_count: 0,
        last_message: 'Welcome to the repair forum!',
        last_message_time: new Date().toISOString(),
        unread_count: 0
      };

      setConversations([mockConversation]);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    refetch: fetchConversations
  };
};
