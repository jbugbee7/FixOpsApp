
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';
import { fetchAllCasesAndPublicCases, PublicCase } from '@/services/publicCasesService';

export const useBasicCaseFetching = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [publicCases, setPublicCases] = useState<PublicCase[]>([]);
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
        setPublicCases([]);
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
      console.log('Starting fetch for cases and public cases');
      
      // If offline or explicitly requesting offline data, try AsyncStorage first
      if (!isOnline || useOfflineData) {
        const offlineData = await AsyncStorage.getCases();
        if (offlineData && offlineData.cases && mountedRef.current) {
          console.log('Using cached data:', offlineData.cases.length, 'cases');
          setCases(offlineData.cases);
          setPublicCases([]); // No offline public cases for now
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

      // Fetch from both tables if online
      if (isOnline) {
        console.log('Fetching from both cases and public_cases tables');
        
        const result = await fetchAllCasesAndPublicCases();

        if (!mountedRef.current) return;

        if (result.error) {
          console.error('Fetch error:', result.error);
          setHasError(true);
          
          // Try cached data as fallback
          const offlineData = await AsyncStorage.getCases();
          if (offlineData?.cases?.length) {
            setCases(offlineData.cases);
            setPublicCases([]);
            toast({
              title: "Using Cached Data",
              description: "Connection issues detected.",
              variant: "default"
            });
          } else {
            setCases([]);
            setPublicCases([]);
          }
        } else {
          console.log('Successfully fetched:', {
            cases: result.cases?.length || 0,
            publicCases: result.publicCases?.length || 0
          });
          console.log('Cases data sample:', result.cases?.slice(0, 2));
          console.log('Public cases data sample:', result.publicCases?.slice(0, 2));
          setCases(result.cases || []);
          setPublicCases(result.publicCases || []);
          setHasError(false);
          
          // Store owned cases in cache
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
            setPublicCases([]);
            toast({
              title: "Using Cached Data",
              description: "Connection error detected.",
              variant: "default"
            });
          } else {
            setCases([]);
            setPublicCases([]);
          }
        } catch (storageError) {
          console.error('Error accessing cached data:', storageError);
          setCases([]);
          setPublicCases([]);
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
    }, 50);
    
    return () => {
      clearTimeout(timeoutId);
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
    publicCases,
    setCases,
    setPublicCases,
    loading,
    hasError,
    fetchCases
  };
};
