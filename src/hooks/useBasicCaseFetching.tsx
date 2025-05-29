
import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';
import { fetchAllCases } from '@/services/casesService';

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
      console.log('Starting fetch for ALL cases - cross-user visibility enabled');
      
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

      // Fetch ALL cases for cross-user visibility if online
      if (isOnline) {
        console.log('Fetching ALL cases from database - all authenticated users can see all work orders');
        
        const result = await fetchAllCases();

        if (!mountedRef.current) return;

        if (result.error) {
          console.error('Supabase error:', result.error);
          setHasError(true);
          
          // Handle specific errors more efficiently
          if (result.error.code === '42P17' || result.error.message.includes('policy')) {
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
          console.log('Successfully fetched ALL cases:', result.cases?.length || 0, 'cases from all users');
          setCases(result.cases || []);
          setHasError(false);
          
          // Efficiently store data only if changed
          if (result.cases?.length) {
            AsyncStorage.storeCases(result.cases);
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
        console.log('Case fetch completed - cross-user visibility active');
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
    }, 50);
    
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
