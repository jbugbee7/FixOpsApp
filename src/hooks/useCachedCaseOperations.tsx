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
  const hasInitializedRef = useRef(false);

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

    console.log('Fetching cases for user:', user.id, 'online:', isOnline);
    
    try {
      setHasError(false);

      // Load cache first for immediate response
      if (!hasInitializedRef.current) {
        const cachedData = await AsyncStorage.getCases();
        if (cachedData?.cases?.length && mountedRef.current) {
          console.log('Loading cached cases:', cachedData.cases.length);
          setCases(cachedData.cases);
          setHasOfflineData(true);
          setLoading(false);
          hasInitializedRef.current = true;
          
          // If offline, stop here
          if (!isOnline) return;
        }
      }

      // Fetch from server if online
      if (isOnline) {
        console.log('Fetching from cached-cases edge function');
        const { data, error } = await supabase.functions.invoke('cached-cases', {
          method: 'GET'
        });

        if (!mountedRef.current) return;

        if (error) {
          console.error('Cached function error:', error);
          setHasError(true);
          
          // Keep cached data if available
          if (!hasInitializedRef.current) {
            setCases([]);
          }
        } else {
          console.log('Successfully fetched cases:', data?.length || 0);
          setCases(data || []);
          setHasError(false);
          setHasOfflineData(false);
          hasInitializedRef.current = true;
          
          // Update cache
          if (data?.length) {
            AsyncStorage.storeCases(data);
          }
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (mountedRef.current) {
        setHasError(true);
        if (!hasInitializedRef.current) {
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
      hasInitializedRef.current = false; // Force fresh fetch
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
