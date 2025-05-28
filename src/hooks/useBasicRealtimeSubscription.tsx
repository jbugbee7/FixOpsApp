
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useBasicRealtimeSubscription = (user: any, isOnline: boolean, fetchCases: () => Promise<void>) => {
  const hasFetchedRef = useRef(false);
  const subscriptionRef = useRef<any>(null);
  const lastFetchRef = useRef(0);

  useEffect(() => {
    if (!user?.id) {
      console.log('No user ID for realtime subscription');
      return;
    }

    // Only fetch once on mount - call immediately without delay
    if (!hasFetchedRef.current) {
      console.log('Initial fetch for realtime subscription for user:', user.id);
      fetchCases();
      hasFetchedRef.current = true;
    }

    // Subscribe to real-time changes only if online and not already subscribed
    if (isOnline && !subscriptionRef.current) {
      console.log('Setting up realtime subscription for user:', user.id);
      
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
            console.log('Real-time change received:', payload.eventType);
            
            // Debounce rapid changes to prevent excessive fetching
            const now = Date.now();
            if (now - lastFetchRef.current < 2000) {
              console.log('Debouncing realtime fetch');
              return;
            }
            lastFetchRef.current = now;
            
            // Add delay to allow database to settle
            setTimeout(() => {
              console.log('Triggering fetch from realtime change');
              fetchCases();
            }, 1500);
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
        });
    }

    // Clean up subscription when going offline
    if (!isOnline && subscriptionRef.current) {
      console.log('Cleaning up realtime subscription (offline)');
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    return () => {
      if (subscriptionRef.current) {
        console.log('Cleaning up realtime subscription (unmount)');
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user?.id, isOnline, fetchCases]); // Add fetchCases to dependencies
};
