
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';

export const useBasicCaseFetching = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async (useOfflineData = false) => {
    if (!user) {
      console.log('No user found, skipping case fetch');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
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
        console.log('Fetching cases from Supabase for user:', user.id);
        
        // Query cases with RLS - this will automatically filter based on the user's permissions
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching cases:', error);
          
          // Check if it's an authentication error
          if (error.message.includes('JWTError') || error.message.includes('JWT')) {
            console.log('JWT error detected, user may need to re-authenticate');
            toast({
              title: "Authentication Error",
              description: "Please sign out and sign back in to continue.",
              variant: "destructive"
            });
          } else {
            // For any other error, try to fallback to AsyncStorage
            const offlineData = await AsyncStorage.getCases();
            if (offlineData && offlineData.cases && offlineData.cases.length > 0) {
              setCases(offlineData.cases);
              toast({
                title: "Using Cached Data",
                description: "Unable to connect to server. Showing cached data.",
                variant: "default"
              });
            } else {
              // No cached data available, show empty state
              setCases([]);
              console.log('No cached data available, showing empty state');
            }
          }
        } else {
          console.log('Cases fetched successfully:', data?.length || 0);
          setCases(data || []);
          
          // Store fresh data in AsyncStorage for offline use
          if (data && data.length > 0) {
            await AsyncStorage.storeCases(data);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      
      // Fallback to AsyncStorage on any error
      const offlineData = await AsyncStorage.getCases();
      if (offlineData && offlineData.cases && offlineData.cases.length > 0) {
        setCases(offlineData.cases);
        toast({
          title: "Using Cached Data",
          description: "Connection error. Showing cached data.",
          variant: "default"
        });
      } else {
        // No cached data available
        setCases([]);
        console.log('No cached data available after error');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    cases,
    setCases,
    loading,
    fetchCases
  };
};
