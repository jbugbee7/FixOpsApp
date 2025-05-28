
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useBasicRealtimeSubscription = (user: any, isOnline: boolean, fetchCases: () => Promise<void>) => {
  const hasFetchedRef = useRef(false);
  const subscriptionRef = useRef<any>(null);
  const lastFetchRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.id || !mountedRef.current) {
      console.log('No user ID or unmounted, skipping realtime subscription');
      return;
    }

    // Initial fetch - only once
    if (!hasFetchedRef.current) {
      console.log('Initial fetch for realtime subscription');
      fetchCases();
      hasFetchedRef.current = true;
    }

    // Subscribe to real-time changes only if online
    if (isOnline && !subscriptionRef.current) {
      console.log('Setting up optimized realtime subscription');
      
      subscriptionRef.current = supabase
        .channel(`user-cases-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cases',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (!mountedRef.current) return;
            
            console.log('Real-time change received:', payload.eventType);
            
            // Optimized debouncing
            const now = Date.now();
            if (now - lastFetchRef.current < 2000) {
              console.log('Debouncing realtime fetch');
              return;
            }
            lastFetchRef.current = now;
            
            // Clear existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            
            // Optimized delay for better performance
            timeoutRef.current = setTimeout(() => {
              if (mountedRef.current) {
                console.log('Triggering optimized fetch from realtime');
                fetchCases();
              }
            }, 500);
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user?.id, isOnline, fetchCases]);
};
