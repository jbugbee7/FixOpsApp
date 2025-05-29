
import { Case } from '@/types/case';

export const AsyncStorage = {
  // Fast storage with error recovery
  storeCases: async (cases: Case[]): Promise<void> => {
    try {
      const timestamp = new Date().toISOString();
      const dataToStore = {
        cases: cases.slice(0, 100), // Increased limit but still reasonable
        lastSync: timestamp,
        offline: !navigator.onLine
      };
      
      const compressed = JSON.stringify(dataToStore);
      localStorage.setItem('fixops_cases', compressed);
      console.log('Cases stored successfully:', cases.length);
    } catch (error) {
      console.error('Storage error:', error);
      // Clear old data and try with smaller dataset
      try {
        localStorage.removeItem('fixops_cases');
        localStorage.setItem('fixops_cases', JSON.stringify({
          cases: cases.slice(0, 20),
          lastSync: new Date().toISOString(),
          offline: !navigator.onLine
        }));
      } catch (retryError) {
        console.error('Storage retry failed:', retryError);
      }
    }
  },

  // Fast retrieval with fallbacks
  getCases: async (): Promise<{ cases: Case[]; lastSync: string; offline: boolean } | null> => {
    try {
      const stored = localStorage.getItem('fixops_cases');
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      console.log('Cases retrieved from cache:', parsed.cases?.length || 0);
      return parsed;
    } catch (error) {
      console.error('Retrieval error:', error);
      // Clear corrupted data
      localStorage.removeItem('fixops_cases');
      return null;
    }
  },

  // Fast clear
  clearCases: async (): Promise<void> => {
    try {
      localStorage.removeItem('fixops_cases');
      console.log('Cache cleared');
    } catch (error) {
      console.error('Clear error:', error);
    }
  },

  // Fast check
  hasOfflineData: async (): Promise<boolean> => {
    try {
      return !!localStorage.getItem('fixops_cases');
    } catch (error) {
      console.error('Check error:', error);
      return false;
    }
  }
};
