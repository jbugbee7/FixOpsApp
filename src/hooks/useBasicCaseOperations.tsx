
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';

interface Case {
  id: string;
  customer_name: string;
  appliance_brand: string;
  appliance_type: string;
  status: string;
  created_at: string;
  customer_phone?: string;
  customer_address?: string;
  problem_description: string;
  initial_diagnosis?: string;
  company_id?: string;
}

export const useBasicCaseOperations = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasOfflineData, setHasOfflineData] = useState(false);

  // Check for offline data on mount
  useEffect(() => {
    const checkOfflineData = async () => {
      const hasData = await AsyncStorage.hasOfflineData();
      setHasOfflineData(hasData);
    };
    checkOfflineData();
  }, []);

  // Store cases when going offline
  useEffect(() => {
    if (!isOnline && cases.length > 0) {
      AsyncStorage.storeCases(cases);
    }
  }, [isOnline, cases]);

  // Fetch cases from Supabase or AsyncStorage
  const fetchCases = async (useOfflineData = false) => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      // If offline or explicitly requesting offline data, try AsyncStorage first
      if (!isOnline || useOfflineData) {
        const offlineData = await AsyncStorage.getCases();
        if (offlineData) {
          setCases(offlineData.cases || []);
          console.log('Loaded cases from AsyncStorage:', offlineData.cases?.length || 0);
          if (!isOnline) {
            toast({
              title: "Offline Mode",
              description: "Loading cached data. Connect to internet to sync latest changes.",
              variant: "default"
            });
            setLoading(false);
            return;
          }
        }
      }

      // Try to fetch from Supabase if online
      if (isOnline) {
        console.log('Fetching cases for user:', user.id);
        
        // First try to get cases by user_id (fallback approach)
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching cases:', error);
          
          // Fallback to AsyncStorage if Supabase fails
          const offlineData = await AsyncStorage.getCases();
          if (offlineData) {
            setCases(offlineData.cases || []);
            toast({
              title: "Using Cached Data",
              description: "Unable to connect to server. Showing cached data.",
              variant: "default"
            });
          } else {
            toast({
              title: "Error Loading Work Orders",
              description: "Failed to load work orders and no cached data available.",
              variant: "destructive"
            });
          }
          return;
        }

        console.log('Fetched cases successfully:', data?.length || 0);
        setCases(data || []);
        
        // Store fresh data in AsyncStorage for offline use
        if (data && data.length > 0) {
          await AsyncStorage.storeCases(data);
        }
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      
      // Fallback to AsyncStorage on any error
      const offlineData = await AsyncStorage.getCases();
      if (offlineData) {
        setCases(offlineData.cases || []);
        toast({
          title: "Using Cached Data",
          description: "Connection error. Showing cached data.",
          variant: "default"
        });
      } else {
        toast({
          title: "Error Loading Work Orders", 
          description: "An unexpected error occurred and no cached data is available.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for cases
  useEffect(() => {
    if (!user) return;

    fetchCases();

    // Subscribe to real-time changes only if online
    if (isOnline) {
      const channel = supabase
        .channel('user-cases-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cases',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Real-time change received:', payload);
            fetchCases(); // Refetch cases when changes occur
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isOnline]);

  const updateCaseStatus = async (caseId: string, newStatus: string) => {
    try {
      if (!isOnline) {
        toast({
          title: "Offline Mode",
          description: "Cannot update work orders while offline. Changes will be lost.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('cases')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', caseId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating case status:', error);
        toast({
          title: "Error Updating Work Order",
          description: "Failed to update work order status.",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      const updatedCases = cases.map(case_ => 
        case_.id === caseId ? { ...case_, status: newStatus } : case_
      );
      setCases(updatedCases);

      // Update AsyncStorage with new data
      await AsyncStorage.storeCases(updatedCases);

      toast({
        title: "Work Order Updated",
        description: `Work order status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating case status:', error);
      toast({
        title: "Error Updating Work Order",
        description: "An unexpected error occurred while updating the work order.",
        variant: "destructive"
      });
    }
  };

  const handleResync = async () => {
    try {
      if (!isOnline) {
        // If offline, load from AsyncStorage
        const offlineData = await AsyncStorage.getCases();
        if (offlineData) {
          setCases(offlineData.cases || []);
          toast({
            title: "Offline Data Loaded",
            description: "Loaded cached data. Connect to internet to sync with server.",
          });
        } else {
          toast({
            title: "No Offline Data",
            description: "No cached data available. Connect to internet to load data.",
            variant: "destructive"
          });
        }
      } else {
        // If online, fetch fresh data from Supabase
        await fetchCases();
        await AsyncStorage.clearCases(); // Clear old cache
        setHasOfflineData(false);
        toast({
          title: "Resync Complete",
          description: "All data has been synchronized with the server.",
        });
      }
    } catch (error) {
      toast({
        title: "Resync Failed",
        description: "Failed to synchronize data. Please check your connection.",
        variant: "destructive"
      });
    }
  };

  return {
    cases,
    loading,
    hasOfflineData,
    updateCaseStatus,
    handleResync
  };
};
