
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';

export const useMobileCaseOperations = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  
  const mountedRef = useRef(true);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
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

    // Aggressive debouncing for mobile
    const now = Date.now();
    if (now - lastFetchRef.current < 1000) {
      return;
    }
    lastFetchRef.current = now;

    console.log('Mobile-optimized fetch for user:', user.id);
    
    try {
      setHasError(false);

      // Immediate cache loading for mobile responsiveness
      const cachedData = await AsyncStorage.getCases();
      if (cachedData?.cases?.length && mountedRef.current) {
        console.log('Fast cache load:', cachedData.cases.length);
        setCases(cachedData.cases);
        setHasOfflineData(true);
        setLoading(false);
        
        // If offline, stop here
        if (!isOnline) return;
      }

      // Background sync if online
      if (isOnline) {
        // Use shorter timeout for mobile
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

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
            console.error('Mobile fetch error:', error);
            setHasError(true);
            
            // Keep cached data on error
            if (!cachedData?.cases?.length) {
              setCases([]);
            }
          } else {
            console.log('Mobile sync complete:', data?.length || 0);
            setCases(data || []);
            setHasError(false);
            setHasOfflineData(false);
            
            // Background cache update
            if (data?.length) {
              AsyncStorage.storeCases(data);
            }
          }
        } catch (fetchError) {
          if (fetchError.name !== 'AbortError') {
            console.error('Mobile fetch timeout or error:', fetchError);
            setHasError(true);
          }
        }
      }
    } catch (error) {
      console.error('Mobile fetch error:', error);
      if (mountedRef.current) {
        setHasError(true);
        const cachedData = await AsyncStorage.getCases();
        if (!cachedData?.cases?.length) {
          setCases([]);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user?.id, isOnline]);

  const updateCaseStatus = useCallback(async (caseId: string, newStatus: string): Promise<boolean> => {
    if (!isOnline || !user?.id) return false;

    try {
      // @ts-ignore - Avoiding deep type instantiation
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
      console.error('Mobile status update error:', error);
      return false;
    }
  }, [isOnline, user?.id]);

  const handleResync = useCallback(async () => {
    if (isOnline) {
      lastFetchRef.current = 0; // Reset debounce
      await fetchCases();
      toast({
        title: "Synced",
        description: "Data updated successfully.",
      });
    } else {
      const offlineData = await AsyncStorage.getCases();
      if (offlineData?.cases) {
        setCases(offlineData.cases);
        setHasOfflineData(true);
        toast({
          title: "Offline Mode",
          description: "Showing cached data.",
        });
      }
    }
  }, [isOnline, fetchCases]);

  // Initial fetch with mobile optimization
  useEffect(() => {
    if (user?.id && mountedRef.current) {
      // Immediate execution for mobile
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
