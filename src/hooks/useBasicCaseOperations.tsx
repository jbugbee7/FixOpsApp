import { useOfflineData } from './useOfflineData';
import { useBasicCaseFetching } from './useBasicCaseFetching';
import { useBasicCaseStatusUpdate } from './useBasicCaseStatusUpdate';
import { useBasicResyncOperations } from './useBasicResyncOperations';
import { useBasicRealtimeSubscription } from './useBasicRealtimeSubscription';
import { Case } from '@/types/case';

export const useBasicCaseOperations = (user: any, isOnline: boolean) => {
  console.log('useBasicCaseOperations initialized for user:', user?.id, 'online:', isOnline);
  
  const { cases, publicCases, setCases, setPublicCases, loading, hasError, fetchCases } = useBasicCaseFetching(user, isOnline);
  
  // Combine cases and public cases for display (cast to Case[] for compatibility)
  const allCases = [...cases, ...publicCases.map(pc => ({ ...pc, company_id: '' } as Case))];
  
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
