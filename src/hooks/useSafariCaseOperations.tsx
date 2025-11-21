import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';
import { fetchAllCases } from '@/services/casesService';

export const useSafariCaseOperations = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  
  const mountedRef = useRef(true);
  const initializedRef = useRef(false);
  const subscriptionRef = useRef<any>(null);

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

    console.log('Safari-optimized fetch for ALL cases - cross-user visibility');
    
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

      // Fetch ALL cases from server if online
      if (isOnline) {
        console.log('Fetching ALL cases from database - cross-user visibility enabled');
        
        const result = await fetchAllCases();

        if (!mountedRef.current) return;

        if (result.error) {
          console.error('Database fetch error:', result.error);
          setHasError(true);
          
          // Keep cached data if available
          if (!initializedRef.current) {
            setCases([]);
          }
        } else {
          console.log('Successfully fetched ALL cases:', result.cases?.length || 0);
          setCases(result.cases || []);
          setHasError(false);
          setHasOfflineData(false);
          initializedRef.current = true;
          
          // Update cache in background
          if (result.cases?.length) {
            AsyncStorage.storeCases(result.cases);
          }
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
        .eq('id', caseId);

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
    if (!user?.id) return;

    if (isOnline) {
      try {
        console.log('Syncing all cases from database...');
        
        // Fetch all cases including newly added ones
        initializedRef.current = false;
        await fetchCases();
        
        toast({
          title: "Sync Complete",
          description: "All work orders synchronized successfully.",
        });
      } catch (error) {
        console.error('Sync error:', error);
        toast({
          title: "Sync Failed",
          description: "Failed to sync work orders.",
          variant: "destructive"
        });
      }
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
  }, [isOnline, user?.id, fetchCases]);

  // Set up real-time subscription for ALL cases
  useEffect(() => {
    if (!user?.id || !isOnline || !mountedRef.current) return;

    console.log('Setting up real-time subscription for ALL cases - cross-user visibility');
    
    subscriptionRef.current = supabase
      .channel('all-cases-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cases'
        },
        (payload) => {
          if (!mountedRef.current) return;
          
          console.log('Real-time change received for ALL cases:', payload.eventType);
          
          // Refetch all cases when any change occurs
          setTimeout(() => {
            if (mountedRef.current) {
              fetchCases();
            }
          }, 500);
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status for ALL cases:', status);
      });

    return () => {
      if (subscriptionRef.current) {
        console.log('Cleaning up real-time subscription');
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user?.id, isOnline, fetchCases]);

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchCases();
    }
  }, [user?.id, fetchCases]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, []);

  return {
    cases,
    loading,
    hasError,
    hasOfflineData,
    updateCaseStatus,
    handleResync
  };
};
