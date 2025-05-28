
import { useOfflineData } from './useOfflineData';
import { useCompanyCaseFetching } from './useCompanyCaseFetching';
import { useCompanyCaseStatusUpdate } from './useCompanyCaseStatusUpdate';
import { useCompanyResyncOperations } from './useCompanyResyncOperations';
import { useCompanyRealtimeSubscription } from './useCompanyRealtimeSubscription';

export const useCompanyCaseOperations = (user: any, isOnline: boolean) => {
  const { cases, setCases, loading, fetchCases } = useCompanyCaseFetching(user, isOnline);
  const { hasOfflineData, setHasOfflineData } = useOfflineData(isOnline, cases);
  const { updateCaseStatus } = useCompanyCaseStatusUpdate(user, isOnline, cases, setCases);
  const { handleResync } = useCompanyResyncOperations(isOnline, setCases, setHasOfflineData, fetchCases);
  
  // Set up real-time subscription
  useCompanyRealtimeSubscription(user, isOnline, fetchCases);

  return {
    cases,
    loading,
    hasOfflineData,
    updateCaseStatus,
    handleResync
  };
};
