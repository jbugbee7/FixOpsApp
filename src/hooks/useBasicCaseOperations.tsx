
import { useOfflineData } from './useOfflineData';
import { useBasicCaseFetching } from './useBasicCaseFetching';
import { useBasicCaseStatusUpdate } from './useBasicCaseStatusUpdate';
import { useBasicResyncOperations } from './useBasicResyncOperations';
import { useBasicRealtimeSubscription } from './useBasicRealtimeSubscription';

export const useBasicCaseOperations = (user: any, isOnline: boolean) => {
  console.log('useBasicCaseOperations initialized for user:', user?.id, 'online:', isOnline);
  
  const { cases, setCases, loading, hasError, fetchCases } = useBasicCaseFetching(user, isOnline);
  const { hasOfflineData, setHasOfflineData } = useOfflineData(isOnline, cases);
  const { updateCaseStatus } = useBasicCaseStatusUpdate(user, isOnline, cases, setCases);
  const { handleResync } = useBasicResyncOperations(isOnline, setCases, setHasOfflineData, fetchCases);
  
  // Set up real-time subscription
  useBasicRealtimeSubscription(user, isOnline, fetchCases);

  return {
    cases,
    loading,
    hasError,
    hasOfflineData,
    updateCaseStatus,
    handleResync
  };
};
