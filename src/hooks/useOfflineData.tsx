
import { useState, useEffect } from 'react';
import { AsyncStorage } from '@/utils/asyncStorage';

interface Case {
  id: string;
  customer_name: string;
  appliance_brand: string;
  appliance_type: string;
  status: string;
  created_at: string;
  customer_phone?: string;
  customer_address?: string;
  problem_description: string;
  initial_diagnosis?: string;
}

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
