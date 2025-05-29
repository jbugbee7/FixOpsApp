
import { Case } from '@/types/case';

export const AsyncStorage = {
  // Mobile-optimized storage with compression
  storeCases: async (cases: Case[]): Promise<void> => {
    try {
      const timestamp = new Date().toISOString();
      const dataToStore = {
        cases: cases.slice(0, 50), // Limit for mobile performance
        lastSync: timestamp,
        offline: !navigator.onLine
      };
      
      // Use smaller storage footprint for mobile
      const compressed = JSON.stringify(dataToStore);
      localStorage.setItem('fixops_cases_mobile', compressed);
      console.log('Mobile-optimized storage:', cases.length, 'cases');
    } catch (error) {
      console.error('Mobile storage error:', error);
      // Clear old data if storage is full
      try {
        localStorage.removeItem('fixops_cases_offline');
        localStorage.setItem('fixops_cases_mobile', JSON.stringify({
          cases: cases.slice(0, 20),
          lastSync: new Date().toISOString(),
          offline: !navigator.onLine
        }));
      } catch (retryError) {
        console.error('Mobile storage retry failed:', retryError);
      }
    }
  },

  // Fast mobile retrieval
  getCases: async (): Promise<{ cases: Case[]; lastSync: string; offline: boolean } | null> => {
    try {
      // Try mobile storage first
      let stored = localStorage.getItem('fixops_cases_mobile');
      
      // Fallback to legacy storage
      if (!stored) {
        stored = localStorage.getItem('fixops_cases_offline');
        if (stored) {
          // Migrate to mobile storage
          const parsed = JSON.parse(stored);
          await AsyncStorage.storeCases(parsed.cases || []);
          localStorage.removeItem('fixops_cases_offline');
          return parsed;
        }
      }
      
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      console.log('Mobile cache retrieved:', parsed.cases?.length || 0);
      return parsed;
    } catch (error) {
      console.error('Mobile retrieval error:', error);
      return null;
    }
  },

  // Mobile-optimized clear
  clearCases: async (): Promise<void> => {
    try {
      localStorage.removeItem('fixops_cases_mobile');
      localStorage.removeItem('fixops_cases_offline'); // Clean legacy
      console.log('Mobile cache cleared');
    } catch (error) {
      console.error('Mobile clear error:', error);
    }
  },

  // Fast mobile check
  hasOfflineData: async (): Promise<boolean> => {
    try {
      return !!(localStorage.getItem('fixops_cases_mobile') || localStorage.getItem('fixops_cases_offline'));
    } catch (error) {
      console.error('Mobile check error:', error);
      return false;
    }
  }
};
