
import { useState, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';

export const useBasicCaseFetching = (user: any, isOnline: boolean) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const fetchingRef = useRef(false);

  const fetchCases = async (useOfflineData = false) => {
    if (!user) {
      console.log('No user found, skipping case fetch');
      setLoading(false);
      return;
    }
    
    // Prevent multiple simultaneous fetch attempts
    if (fetchingRef.current) {
      console.log('Fetch already in progress, skipping duplicate request');
      return;
    }
    
    fetchingRef.current = true;
    setLoading(true);
    setHasError(false);
    
    try {
      console.log('Starting case fetch for user:', user.id, 'online:', isOnline);
      
      // If offline or explicitly requesting offline data, try AsyncStorage first
      if (!isOnline || useOfflineData) {
        const offlineData = await AsyncStorage.getCases();
        if (offlineData && offlineData.cases) {
          console.log('Using cached data:', offlineData.cases.length, 'cases');
          setCases(offlineData.cases);
          if (!isOnline) {
            toast({
              title: "Offline Mode",
              description: "Loading cached data. Connect to internet to sync latest changes.",
              variant: "default"
            });
            setLoading(false);
            fetchingRef.current = false;
            return;
          }
        }
      }

      // Try to fetch from Supabase if online
      if (isOnline) {
        console.log('Attempting to fetch from Supabase...');
        
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          setHasError(true);
          
          // Handle specific database policy errors
          if (error.code === '42P17' || error.message.includes('infinite recursion')) {
            console.log('Database policy error detected - using fallback');
            
            // Try to load cached data as fallback
            const offlineData = await AsyncStorage.getCases();
            if (offlineData && offlineData.cases && offlineData.cases.length > 0) {
              console.log('Using cached data as fallback:', offlineData.cases.length, 'cases');
              setCases(offlineData.cases);
              toast({
                title: "Database Configuration Issue",
                description: "Using cached data while database policies are being updated.",
                variant: "default"
              });
            } else {
              console.log('No cached data available, showing empty state');
              setCases([]);
            }
          } else if (error.message.includes('JWTError') || error.message.includes('JWT')) {
            console.log('JWT error detected');
            setCases([]);
            toast({
              title: "Authentication Error",
              description: "Please sign out and sign back in to continue.",
              variant: "destructive"
            });
          } else {
            // For other errors, try to fallback to cached data
            const offlineData = await AsyncStorage.getCases();
            if (offlineData && offlineData.cases && offlineData.cases.length > 0) {
              console.log('Using cached data after error:', offlineData.cases.length, 'cases');
              setCases(offlineData.cases);
              toast({
                title: "Using Cached Data",
                description: "Unable to connect to server. Showing cached data.",
                variant: "default"
              });
            } else {
              console.log('No cached data available after error');
              setCases([]);
            }
          }
        } else {
          console.log('Successfully fetched from Supabase:', data?.length || 0, 'cases');
          setCases(data || []);
          setHasError(false);
          
          // Store fresh data for offline use
          if (data && data.length > 0) {
            await AsyncStorage.storeCases(data);
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error during fetch:', error);
      setHasError(true);
      
      // Final fallback to cached data
      try {
        const offlineData = await AsyncStorage.getCases();
        if (offlineData && offlineData.cases && offlineData.cases.length > 0) {
          console.log('Using cached data after unexpected error:', offlineData.cases.length, 'cases');
          setCases(offlineData.cases);
          toast({
            title: "Using Cached Data",
            description: "Connection error. Showing cached data.",
            variant: "default"
          });
        } else {
          console.log('No cached data available after unexpected error');
          setCases([]);
        }
      } catch (storageError) {
        console.error('Error accessing cached data:', storageError);
        setCases([]);
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
      console.log('Case fetch completed');
    }
  };

  return {
    cases,
    setCases,
    loading,
    hasError,
    fetchCases
  };
};
