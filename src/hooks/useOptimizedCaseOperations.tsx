import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Tables } from '@/integrations/supabase/types';

type Case = Tables<'cases'>;

export const useOptimizedCaseOperations = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  
  const mountedRef = useRef(true);

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

      if (isOnline) {
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .order('created_at', { ascending: false });

        if (!mountedRef.current) return;

        if (error) {
          console.error('Cases fetch error:', error);
          setHasError(true);
          setCases([]);
        } else {
          console.log('Successfully fetched cases:', data?.length || 0);
          setCases(data || []);
          setHasError(false);
          setHasOfflineData(false);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (mountedRef.current) {
        setHasError(true);
        setCases([]);
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
    if (isOnline) {
      await fetchCases();
      toast({
        title: "Sync Complete",
        description: "Data synchronized successfully.",
      });
    }
  }, [isOnline, fetchCases]);

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
