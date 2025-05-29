
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';

export const useCachedCaseOperations = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  
  const mountedRef = useRef(true);
  const lastFetchRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchCases = useCallback(async () => {
    if (!user?.id || !mountedRef.current) {
      if (mountedRef.current) {
        setLoading(false);
        setCases([]);
      }
      return;
    }

    // Debounce rapid requests
    const now = Date.now();
    if (now - lastFetchRef.current < 500) {
      return;
    }
    lastFetchRef.current = now;

    console.log('Fetching cached cases for user:', user.id);
    
    try {
      setHasError(false);

      // Try cache first for immediate loading
      const cachedData = await AsyncStorage.getCases();
      if (cachedData?.cases?.length && mountedRef.current) {
        console.log('Loading local cache:', cachedData.cases.length);
        setCases(cachedData.cases);
        setHasOfflineData(true);
        setLoading(false);
        
        if (!isOnline) return;
      }

      // Use cached edge function if online
      if (isOnline) {
        try {
          const { data, error } = await supabase.functions.invoke('cached-cases', {
            method: 'GET'
          });

          if (!mountedRef.current) return;

          if (error) {
            console.error('Cached function error:', error);
            setHasError(true);
            
            if (!cachedData?.cases?.length) {
              setCases([]);
            }
          } else {
            console.log('Successfully fetched cached cases:', data?.length || 0);
            setCases(data || []);
            setHasError(false);
            setHasOfflineData(false);
            
            // Update local cache
            if (data?.length) {
              AsyncStorage.storeCases(data);
            }
          }
        } catch (fetchError) {
          console.error('Edge function call failed:', fetchError);
          setHasError(true);
          
          if (!cachedData?.cases?.length) {
            setCases([]);
          }
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (mountedRef.current) {
        setHasError(true);
        const fallbackData = await AsyncStorage.getCases();
        if (!fallbackData?.cases?.length) {
          setCases([]);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user?.id, isOnline]);

  const updateCaseStatus = useCallback(async (caseId: string, newStatus: string) => {
    if (!isOnline || !user?.id) return false;

    try {
      const { error } = await supabase
        .from('cases')
        .update({ status: newStatus })
        .eq('id', caseId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Optimistic update
      setCases(prev => 
        prev.map(c => c.id === caseId ? { ...c, status: newStatus } : c)
      );
      return true;
    } catch (error) {
      console.error('Status update error:', error);
      return false;
    }
  }, [isOnline, user?.id]);

  const handleResync = useCallback(async () => {
    if (isOnline) {
      lastFetchRef.current = 0; // Force fresh fetch
      await fetchCases();
      toast({
        title: "Sync Complete",
        description: "Data synchronized successfully.",
      });
    } else {
      const offlineData = await AsyncStorage.getCases();
      if (offlineData?.cases) {
        setCases(offlineData.cases);
        setHasOfflineData(true);
        toast({
          title: "Offline Data Loaded",
          description: "Showing cached data.",
        });
      }
    }
  }, [isOnline, fetchCases]);

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchCases();
    }
  }, [user?.id, fetchCases]);

  return {
    cases,
    loading,
    hasError,
    hasOfflineData,
    updateCaseStatus,
    handleResync
  };
};
