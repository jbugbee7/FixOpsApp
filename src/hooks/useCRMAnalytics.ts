
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
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

  // Communication and interactions tables don't exist yet
  // Return empty arrays for now
  const communicationData: any[] = [];
  const interactionsData: any[] = [];

  const isLoading = casesLoading;

  const refetchAll = () => {
    refetchCases();
  };

  return {
    casesData: casesData || [],
    communicationData,
    interactionsData,
    isLoading,
    refetchAll
  };
};
