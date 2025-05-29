
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';

export const useOptimizedCaseOperations = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  
  const mountedRef = useRef(true);
  const subscriptionRef = useRef<any>(null);
  const fetchingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchCases = useCallback(async () => {
    if (!user?.id || fetchingRef.current || !mountedRef.current) {
      if (mountedRef.current) setLoading(false);
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    setHasError(false);

    try {
      // Try cache first for faster loading
      const cachedData = await AsyncStorage.getCases();
      if (cachedData?.cases?.length && mountedRef.current) {
        setCases(cachedData.cases);
        setHasOfflineData(true);
        if (!isOnline) {
          setLoading(false);
          fetchingRef.current = false;
          return;
        }
      }

      // Fetch from server if online
      if (isOnline) {
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!mountedRef.current) return;

        if (error) {
          console.error('Cases fetch error:', error);
          setHasError(true);
          
          if (!cachedData?.cases?.length) {
            setCases([]);
          }
        } else {
          setCases(data || []);
          setHasError(false);
          setHasOfflineData(false);
          
          // Update cache in background
          if (data?.length) {
            AsyncStorage.storeCases(data);
          }
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (mountedRef.current) {
        setHasError(true);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        fetchingRef.current = false;
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

  // Optimized realtime subscription
  useEffect(() => {
    if (!user?.id || !isOnline || !mountedRef.current) {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      return;
    }

    // Set up single, efficient subscription
    subscriptionRef.current = supabase
      .channel(`optimized-cases-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cases',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          if (mountedRef.current) {
            // Debounced refetch
            setTimeout(() => {
              if (mountedRef.current) fetchCases();
            }, 1000);
          }
        }
      )
      .subscribe();

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user?.id, isOnline, fetchCases]);

  return {
    cases,
    loading,
    hasError,
    hasOfflineData,
    updateCaseStatus,
    handleResync
  };
};
