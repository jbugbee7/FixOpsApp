import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';

export const useSafariCaseOperations = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  
  const mountedRef = useRef(true);
  const initializedRef = useRef(false);

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

    console.log('Safari-optimized fetch for user:', user.id);
    
    try {
      setHasError(false);

      // Load cache first for immediate response
      if (!initializedRef.current) {
        const cachedData = await AsyncStorage.getCases();
        if (cachedData?.cases?.length && mountedRef.current) {
          console.log('Loading cached cases:', cachedData.cases.length);
          setCases(cachedData.cases);
          setHasOfflineData(true);
          setLoading(false);
          initializedRef.current = true;
          
          // If offline, stop here
          if (!isOnline) return;
        }
      }

      // Fetch from server if online - direct database call for reliability
      if (isOnline) {
        console.log('Fetching fresh data directly from database');
        
        // Use a timeout for Safari compatibility
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          const { data, error } = await supabase
            .from('cases')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .abortSignal(controller.signal);

          clearTimeout(timeoutId);

          if (!mountedRef.current) return;

          if (error) {
            console.error('Database fetch error:', error);
            setHasError(true);
            
            // Keep cached data if available
            if (!initializedRef.current) {
              setCases([]);
            }
          } else {
            console.log('Successfully fetched cases:', data?.length || 0);
            setCases(data || []);
            setHasError(false);
            setHasOfflineData(false);
            initializedRef.current = true;
            
            // Update cache in background
            if (data?.length) {
              AsyncStorage.storeCases(data);
            }
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            console.log('Request timed out, using cached data');
          } else {
            console.error('Fetch error:', fetchError);
          }
          setHasError(true);
        }
      }
    } catch (error) {
      console.error('Safari fetch error:', error);
      if (mountedRef.current) {
        setHasError(true);
        if (!initializedRef.current) {
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
      initializedRef.current = false;
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
