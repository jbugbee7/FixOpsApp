
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { RepairSummary } from "@/types/repairSummary";
import { fetchUserCases } from "@/services/casesService";
import { processCasesIntoSummaries } from "@/utils/repairSummaryProcessor";
import { getErrorMessage, validateUser } from "@/utils/repairSummaryErrorHandler";

export { RepairSummary } from "@/types/repairSummary";

export const useRepairSummaries = (user: any) => {
  const [repairSummaries, setRepairSummaries] = useState<RepairSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchRepairSummaries = async () => {
    const userValidation = validateUser(user);
    if (!userValidation.isValid) {
      setHasError(true);
      setErrorMessage(userValidation.errorMessage);
      setLoading(false);
      return;
    }

    try {
      console.log('=== REPAIR SUMMARIES FETCH START ===');
      console.log('User ID:', user.id);
      
      setHasError(false);
      setErrorMessage('');
      
      const result = await fetchUserCases(user.id);

      if (result.error) {
        setHasError(true);
        setErrorMessage(getErrorMessage(result.error));
        setRepairSummaries([]);
        return;
      }

      if (!result.cases || result.cases.length === 0) {
        console.log('=== NO CASES FOUND ===');
        console.log('User has no cases in the database');
        setRepairSummaries([]);
        setHasError(false);
        return;
      }

      const summaries = processCasesIntoSummaries(result.cases);
      setRepairSummaries(summaries);
      setHasError(false);
      
    } catch (error: any) {
      console.error('=== UNEXPECTED ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      setHasError(true);
      setErrorMessage(`Unexpected error: ${error.message || 'Unknown error occurred'}`);
      setRepairSummaries([]);
      
      toast({
        title: "Analysis Error",
        description: "An unexpected error occurred while analyzing your repair data.",
        variant: "destructive",
      });
    } finally {
      console.log('=== REPAIR SUMMARIES FETCH END ===');
    }
  };

  const handleRefreshAnalysis = async () => {
    if (refreshing) {
      console.log('Refresh already in progress, ignoring click');
      return;
    }

    console.log('Starting manual refresh analysis');
    setRefreshing(true);
    
    try {
      await fetchRepairSummaries();
      if (!hasError) {
        toast({
          title: "Analysis Updated",
          description: "Your repair data has been refreshed successfully.",
        });
      }
    } catch (error) {
      console.error('Error during manual refresh:', error);
    } finally {
      setRefreshing(false);
      console.log('Manual refresh complete');
    }
  };

  useEffect(() => {
    console.log('useRepairSummaries mounted, fetching initial data for user:', user?.id);
    fetchRepairSummaries().finally(() => {
      setLoading(false);
    });
  }, [user?.id]); // Only depend on user.id to prevent unnecessary re-fetches

  return {
    repairSummaries,
    loading,
    refreshing,
    hasError,
    errorMessage,
    handleRefreshAnalysis
  };
};
