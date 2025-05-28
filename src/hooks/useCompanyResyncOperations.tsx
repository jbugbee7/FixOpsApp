
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { useCompany } from '@/contexts/CompanyContext';
import { Case } from '@/types/case';

export const useCompanyResyncOperations = (
  isOnline: boolean,
  setCases: (cases: Case[]) => void,
  setHasOfflineData: (hasData: boolean) => void,
  fetchCases: () => Promise<void>
) => {
  const { company } = useCompany();

  // Helper function to ensure cases have company_id
  const ensureCompanyId = (casesData: any[]): Case[] => {
    return casesData.map(case_ => ({
      ...case_,
      company_id: case_.company_id || company?.id || ''
    }));
  };

  const handleResync = async () => {
    try {
      if (!isOnline) {
        // If offline, load from AsyncStorage
        const offlineData = await AsyncStorage.getCases();
        if (offlineData) {
          const casesWithCompanyId = ensureCompanyId(offlineData.cases || []);
          setCases(casesWithCompanyId);
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
    handleResync
  };
};
