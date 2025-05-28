
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useBasicRealtimeSubscription = (user: any, isOnline: boolean, fetchCases: () => Promise<void>) => {
  useEffect(() => {
    if (!user) return;

    fetchCases();

    // Subscribe to real-time changes only if online
    if (isOnline) {
      const channel = supabase
        .channel('user-cases-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cases',
            filter: `user_id=eq.${user.id}`
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
};
