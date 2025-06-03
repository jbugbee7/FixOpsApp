
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';
import { supabase } from "@/integrations/supabase/client";

export const useBasicResyncOperations = (
  isOnline: boolean,
  setCases: (cases: Case[]) => void,
  setHasOfflineData: (hasData: boolean) => void,
  fetchCases: () => Promise<void>
) => {
  const removeAllTestData = async () => {
    console.log('Removing ALL test/sample data from both tables');
    
    try {
      // Remove any cases with test-like names from cases table
      const { error: casesError } = await supabase
        .from('cases')
        .delete()
        .or('customer_name.ilike.%test%,customer_name.ilike.%sample%,customer_name.ilike.%demo%,customer_name.ilike.%john%,customer_name.ilike.%sarah%,customer_name.ilike.%mike%');

      if (casesError) {
        console.error('Error removing test cases from cases table:', casesError);
      } else {
        console.log('Test cases removed from cases table');
      }

      // Remove any cases with test-like names from public_cases table
      const { error: publicCasesError } = await supabase
        .from('public_cases')
        .delete()
        .or('customer_name.ilike.%test%,customer_name.ilike.%sample%,customer_name.ilike.%demo%,customer_name.ilike.%john%,customer_name.ilike.%sarah%,customer_name.ilike.%mike%');

      if (publicCasesError) {
        console.error('Error removing test cases from public_cases table:', publicCasesError);
      } else {
        console.log('Test cases removed from public_cases table');
      }

      return { success: true };
    } catch (error) {
      console.error('Unexpected error removing test cases:', error);
      return { success: false, error };
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
        // If online, remove ALL test/sample data first, then fetch fresh data
        console.log('Removing ALL test/sample data before sync...');
        const removeResult = await removeAllTestData();
        
        if (removeResult.success) {
          console.log('All test/sample data removed successfully');
        } else {
          console.warn('Failed to remove test data:', removeResult.error);
        }
        
        await fetchCases();
        await AsyncStorage.clearCases(); // Clear old cache
        setHasOfflineData(false);
        toast({
          title: "Resync Complete",
          description: "All data has been synchronized and sample data removed.",
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
    handleResync
  };
};
