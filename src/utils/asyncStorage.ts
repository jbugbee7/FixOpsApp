
// AsyncStorage utility for offline data management
interface StoredCase {
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

export const AsyncStorage = {
  // Store cases data
  storeCases: async (cases: StoredCase[]): Promise<void> => {
    try {
      const timestamp = new Date().toISOString();
      const dataToStore = {
        cases,
        lastSync: timestamp,
        offline: !navigator.onLine
      };
      localStorage.setItem('fixops_cases_offline', JSON.stringify(dataToStore));
      console.log('Cases stored to AsyncStorage:', cases.length);
    } catch (error) {
      console.error('Error storing cases to AsyncStorage:', error);
    }
  },

  // Retrieve stored cases
  getCases: async (): Promise<{ cases: StoredCase[]; lastSync: string; offline: boolean } | null> => {
    try {
      const stored = localStorage.getItem('fixops_cases_offline');
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      console.log('Cases retrieved from AsyncStorage:', parsed.cases?.length || 0);
      return parsed;
    } catch (error) {
      console.error('Error retrieving cases from AsyncStorage:', error);
      return null;
    }
  },

  // Clear stored data
  clearCases: async (): Promise<void> => {
    try {
      localStorage.removeItem('fixops_cases_offline');
      console.log('AsyncStorage cleared');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  },

  // Check if we have offline data
  hasOfflineData: async (): Promise<boolean> => {
    try {
      const stored = localStorage.getItem('fixops_cases_offline');
      return !!stored;
    } catch (error) {
      console.error('Error checking offline data:', error);
      return false;
    }
  }
};
