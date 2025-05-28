
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from '@/contexts/CompanyContext';

export const useCompanyRealtimeSubscription = (user: any, isOnline: boolean, fetchCases: () => Promise<void>) => {
  const { company } = useCompany();

  useEffect(() => {
    if (!user || !company) return;

    fetchCases();

    // Subscribe to real-time changes only if online
    if (isOnline) {
      const channel = supabase
        .channel('company-cases-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cases',
            filter: `company_id=eq.${company.id}`
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
  }, [user, company, isOnline, fetchCases]);
};
