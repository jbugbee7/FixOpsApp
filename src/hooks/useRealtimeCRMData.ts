
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { debounce } from 'lodash';

interface ContactInteraction {
  id: string;
  customer_id: number;
  interaction_type: string;
  subject: string;
  description?: string;
  interaction_date: string;
  status: string;
  priority: string;
  outcome?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

interface CommunicationHistory {
  id: string;
  customer_id: number;
  type: string;
  subject?: string;
  content?: string;
  status: string;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
}

export const useRealtimeCRMData = () => {
  const [interactions, setInteractions] = useState<ContactInteraction[]>([]);
  const [communications, setCommunications] = useState<CommunicationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch functions
  const fetchInteractions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('contact_interactions')
        .select('*')
        .order('interaction_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch interactions:', err);
      return [];
    }
  }, []);

  const fetchCommunications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('communication_history')
        .select('*')
        .order('sent_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch communications:', err);
      return [];
    }
  }, []);

  // Debounced refetch for real-time updates
  const debouncedRefetch = useCallback(
    debounce(async () => {
      console.log('Real-time update: Refetching CRM data');
      try {
        const [interactionsData, communicationsData] = await Promise.all([
          fetchInteractions(),
          fetchCommunications()
        ]);
        
        setInteractions(interactionsData);
        setCommunications(communicationsData);
        setError(null);
      } catch (err) {
        console.error('Real-time CRM refetch error:', err);
        setError('Failed to sync CRM data');
      }
    }, 300),
    [fetchInteractions, fetchCommunications]
  );

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      console.log('Initial CRM data load');
      setLoading(true);
      setError(null);
      
      try {
        const [interactionsData, communicationsData] = await Promise.all([
          fetchInteractions(),
          fetchCommunications()
        ]);
        
        setInteractions(interactionsData);
        setCommunications(communicationsData);
      } catch (err) {
        console.error('Initial CRM data load error:', err);
        setError('Failed to load CRM data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchInteractions, fetchCommunications]);

  // Real-time subscriptions
  useEffect(() => {
    // Tables don't exist yet, skip subscriptions
    return () => {};
  }, [debouncedRefetch]);

  // Create interaction
  const createInteraction = async (interactionData: any) => {
    // Tables don't exist yet
    console.log('Interaction creation not yet implemented:', interactionData);
    toast({
      title: 'Info',
      description: 'Interaction tracking not yet implemented',
    });
    return null;
  };

  return {
    interactions,
    communications,
    loading,
    error,
    createInteraction,
    refetch: debouncedRefetch,
  };
};
