
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';
import { removeTestCases } from '@/services/publicCasesService';

export const useBasicResyncOperations = (
  isOnline: boolean,
  setCases: (cases: Case[]) => void,
  setHasOfflineData: (hasData: boolean) => void,
  fetchCases: () => Promise<void>
) => {
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
        // If online, remove test cases first, then fetch fresh data from Supabase
        console.log('Removing test cases before sync...');
        const removeResult = await removeTestCases();
        
        if (removeResult.success) {
          console.log('Test cases removed successfully');
        } else {
          console.warn('Failed to remove test cases:', removeResult.error);
        }
        
        await fetchCases();
        await AsyncStorage.clearCases(); // Clear old cache
        setHasOfflineData(false);
        toast({
          title: "Resync Complete",
          description: "All data has been synchronized with the server and test cases removed.",
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
