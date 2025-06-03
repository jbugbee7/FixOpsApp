
import { useOfflineData } from './useOfflineData';
import { useBasicCaseFetching } from './useBasicCaseFetching';
import { useBasicCaseStatusUpdate } from './useBasicCaseStatusUpdate';
import { useBasicResyncOperations } from './useBasicResyncOperations';
import { useBasicRealtimeSubscription } from './useBasicRealtimeSubscription';

export const useBasicCaseOperations = (user: any, isOnline: boolean) => {
  console.log('useBasicCaseOperations initialized for user:', user?.id, 'online:', isOnline);
  
  const { cases, publicCases, setCases, setPublicCases, loading, hasError, fetchCases } = useBasicCaseFetching(user, isOnline);
  
  // Combine cases and public cases for display
  const allCases = [...cases, ...publicCases];
  
  const { hasOfflineData, setHasOfflineData } = useOfflineData(isOnline, allCases);
  const { updateCaseStatus } = useBasicCaseStatusUpdate(user, isOnline, cases, setCases, publicCases, setPublicCases);
  const { handleResync } = useBasicResyncOperations(isOnline, setCases, setHasOfflineData, fetchCases);
  
  // Set up real-time subscription
  useBasicRealtimeSubscription(user, isOnline, fetchCases);

  return {
    cases: allCases, // Return combined cases for display
    loading,
    hasError,
    hasOfflineData,
    updateCaseStatus,
    handleResync
  };
};
