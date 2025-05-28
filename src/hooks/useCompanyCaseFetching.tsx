
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { useCompany } from '@/contexts/CompanyContext';
import { Case } from '@/types/case';

export const useCompanyCaseFetching = (user: any, isOnline: boolean) => {
  const { company } = useCompany();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to ensure cases have company_id
  const ensureCompanyId = (casesData: any[]): Case[] => {
    return casesData.map(case_ => ({
      ...case_,
      company_id: case_.company_id || company?.id || ''
    }));
  };

  // Fetch cases from Supabase or AsyncStorage
  const fetchCases = async (useOfflineData = false) => {
    if (!user) {
      console.log('No user found, skipping case fetch');
      setLoading(false);
      return;
    }
    
    try {
      // If offline or explicitly requesting offline data, try AsyncStorage first
      if (!isOnline || useOfflineData) {
        const offlineData = await AsyncStorage.getCases();
        if (offlineData) {
          const casesWithCompanyId = ensureCompanyId(offlineData.cases || []);
          setCases(casesWithCompanyId);
          console.log('Loaded cases from AsyncStorage:', casesWithCompanyId.length);
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
            setLoading(false);
            return;
          }
          
          // Fallback to AsyncStorage if Supabase fails
          const offlineData = await AsyncStorage.getCases();
          if (offlineData) {
            const casesWithCompanyId = ensureCompanyId(offlineData.cases || []);
            setCases(casesWithCompanyId);
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
          setLoading(false);
          return;
        }

        console.log('Cases fetched successfully:', data?.length || 0);
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
        const casesWithCompanyId = ensureCompanyId(offlineData.cases || []);
        setCases(casesWithCompanyId);
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
