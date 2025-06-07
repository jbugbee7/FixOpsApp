
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCRMAnalytics = () => {
  const { toast } = useToast();

  // Real-time cases data
  const { data: casesData, isLoading: casesLoading, refetch: refetchCases } = useQuery({
    queryKey: ['crm-analytics-cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cases for analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load cases data",
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Real-time communication history
  const { data: communicationData, isLoading: communicationLoading, refetch: refetchCommunication } = useQuery({
    queryKey: ['crm-analytics-communication'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communication_history')
        .select('*')
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('Error fetching communication data:', error);
        return [];
      }

      return data || [];
    },
    refetchInterval: 30000,
  });

  // Real-time interactions data
  const { data: interactionsData, isLoading: interactionsLoading, refetch: refetchInteractions } = useQuery({
    queryKey: ['crm-analytics-interactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_interactions')
        .select('*')
        .order('interaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching interactions data:', error);
        return [];
      }

      return data || [];
    },
    refetchInterval: 30000,
  });

  const isLoading = casesLoading || communicationLoading || interactionsLoading;

  const refetchAll = () => {
    refetchCases();
    refetchCommunication();
    refetchInteractions();
  };

  return {
    casesData: casesData || [],
    communicationData: communicationData || [],
    interactionsData: interactionsData || [],
    isLoading,
    refetchAll
  };
};
