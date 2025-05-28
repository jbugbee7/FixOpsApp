
import { useState, useEffect } from 'react';
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';

export const useOfflineData = (isOnline: boolean, cases: Case[]) => {
  const [hasOfflineData, setHasOfflineData] = useState(false);

  // Check for offline data on mount
  useEffect(() => {
    const checkOfflineData = async () => {
      const hasData = await AsyncStorage.hasOfflineData();
      setHasOfflineData(hasData);
    };
    checkOfflineData();
  }, []);

  // Store cases when going offline
  useEffect(() => {
    if (!isOnline && cases.length > 0) {
      AsyncStorage.storeCases(cases);
    }
  }, [isOnline, cases]);

  return {
    hasOfflineData,
    setHasOfflineData
  };
};
