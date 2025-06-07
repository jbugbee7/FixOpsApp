
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useOfflineData } from './useOfflineData';
import { useCaseFetching } from './useCaseFetching';
import { useCaseStatusUpdate } from './useCaseStatusUpdate';
import { useResyncOperations } from './useResyncOperations';

export const useCaseOperations = (user: any, isOnline: boolean) => {
  const { cases, setCases, loading, fetchCases } = useCaseFetching(user, isOnline);
  const { hasOfflineData, setHasOfflineData } = useOfflineData(isOnline, cases);
  const { updateCaseStatus } = useCaseStatusUpdate(isOnline, cases, setCases);
  const { handleResync } = useResyncOperations(isOnline, setCases, setHasOfflineData, fetchCases);

  // Set up real-time subscription for cases
  useEffect(() => {
    if (!user) return;

    fetchCases();

    // Subscribe to real-time changes only if online
    if (isOnline) {
      const channel = supabase
        .channel('cases-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cases'
          },
          (payload) => {
            console.log('Real-time change received:', payload);
            fetchCases(); // Refetch cases when changes occur
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isOnline, fetchCases]);

  return {
    cases,
    loading,
    hasOfflineData,
    updateCaseStatus,
    handleResync
  };
};
