
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useBasicRealtimeSubscription = (user: any, isOnline: boolean, fetchCases: () => Promise<void>) => {
  const hasFetchedRef = useRef(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;

    // Only fetch once on mount
    if (!hasFetchedRef.current) {
      fetchCases();
      hasFetchedRef.current = true;
    }

    // Subscribe to real-time changes only if online and not already subscribed
    if (isOnline && !subscriptionRef.current) {
      subscriptionRef.current = supabase
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
            // Debounce the fetch to prevent rapid successive calls
            setTimeout(() => {
              fetchCases();
            }, 1000);
          }
        )
        .subscribe();
    }

    // Clean up subscription when going offline
    if (!isOnline && subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user, isOnline]); // Remove fetchCases from dependencies to prevent re-subscription
};
