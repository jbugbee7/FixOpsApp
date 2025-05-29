
import { useState } from 'react';

export const useAuthLoading = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withLoading = async <T>(operation: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      return await operation();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    setLoading,
    setError,
    clearError,
    withLoading
  };
};
