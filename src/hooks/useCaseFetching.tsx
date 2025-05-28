
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';

export const useCaseFetching = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async (useOfflineData = false) => {
    if (!user) return;
    
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
        const { data, error } = await supabase
          .from('cases')
          .select('*')
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

  return {
    cases,
    setCases,
    loading,
    setLoading,
    fetchCases
  };
};
