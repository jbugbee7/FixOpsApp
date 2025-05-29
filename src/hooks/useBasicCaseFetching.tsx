
import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';

export const useBasicCaseFetching = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const fetchingRef = useRef(false);
  const lastFetchTime = useRef(0);
  const mountedRef = useRef(true);

  const fetchCases = useCallback(async (useOfflineData = false) => {
    if (!user || !mountedRef.current) {
      console.log('No user or component unmounted, setting loading to false');
      if (mountedRef.current) {
        setLoading(false);
        setCases([]);
      }
      return;
    }
    
    // Debounce rapid fetch requests
    const now = Date.now();
    if (now - lastFetchTime.current < 500) {
      console.log('Debouncing fetch request');
      return;
    }
    lastFetchTime.current = now;
    
    // Prevent multiple simultaneous fetch attempts
    if (fetchingRef.current) {
      console.log('Fetch already in progress, skipping duplicate request');
      return;
    }
    
    fetchingRef.current = true;
    if (mountedRef.current) {
      setLoading(true);
      setHasError(false);
    }
    
    try {
      console.log('Starting optimized case fetch for user:', user.id, 'online:', isOnline);
      
      // If offline or explicitly requesting offline data, try AsyncStorage first
      if (!isOnline || useOfflineData) {
        const offlineData = await AsyncStorage.getCases();
        if (offlineData && offlineData.cases && mountedRef.current) {
          console.log('Using cached data:', offlineData.cases.length, 'cases');
          setCases(offlineData.cases);
          if (!isOnline) {
            toast({
              title: "Offline Mode",
              description: "Showing cached data.",
              variant: "default"
            });
          }
          setLoading(false);
          fetchingRef.current = false;
          return;
        }
      }

      // Try to fetch from Supabase if online - now fetching all cases
      if (isOnline) {
        console.log('Fetching all cases from Supabase');
        
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .order('created_at', { ascending: false });

        if (!mountedRef.current) return;

        if (error) {
          console.error('Supabase error:', error);
          setHasError(true);
          
          // Handle specific errors more efficiently
          if (error.code === '42P17' || error.message.includes('policy')) {
            console.log('Database policy error - showing empty state');
            setCases([]);
            toast({
              title: "Welcome to FixOps",
              description: "Ready to get started!",
              variant: "default"
            });
          } else {
            // Try cached data for other errors
            const offlineData = await AsyncStorage.getCases();
            if (offlineData?.cases?.length) {
              setCases(offlineData.cases);
              toast({
                title: "Using Cached Data",
                description: "Connection issues detected.",
                variant: "default"
              });
            } else {
              setCases([]);
            }
          }
        } else {
          console.log('Successfully fetched:', data?.length || 0, 'cases');
          setCases(data || []);
          setHasError(false);
          
          // Efficiently store data only if changed
          if (data?.length) {
            AsyncStorage.storeCases(data);
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error during fetch:', error);
      if (mountedRef.current) {
        setHasError(true);
        
        // Final fallback to cached data
        try {
          const offlineData = await AsyncStorage.getCases();
          if (offlineData?.cases?.length) {
            setCases(offlineData.cases);
            toast({
              title: "Using Cached Data",
              description: "Connection error detected.",
              variant: "default"
            });
          } else {
            setCases([]);
          }
        } catch (storageError) {
          console.error('Error accessing cached data:', storageError);
          setCases([]);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        fetchingRef.current = false;
        console.log('Case fetch completed');
      }
    }
  }, [user?.id, isOnline]);

  // Optimized effect with cleanup
  useEffect(() => {
    mountedRef.current = true;
    console.log('useBasicCaseFetching effect triggered - user:', user?.id, 'online:', isOnline);
    
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        fetchCases();
      }
    }, 50); // Reduced delay for better responsiveness
    
    return () => {
      clearTimeout(timeoutId);
      mountedRef.current = false;
    };
  }, [fetchCases]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    cases,
    setCases,
    loading,
    hasError,
    fetchCases
  };
};
