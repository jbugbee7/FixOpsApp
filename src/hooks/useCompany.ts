
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserCompany, Company } from '@/services/companyService';

export const useCompany = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadCompany = async () => {
      if (!user) {
        setCompany(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Loading company for user:', user.id);
        const { company: userCompany, error: companyError } = await fetchUserCompany();
        
        if (companyError) {
          setError(companyError);
        } else {
          setCompany(userCompany);
        }
      } catch (err) {
        console.error('Error loading company:', err);
        setError('Failed to load company information');
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [user]);

  const refreshCompany = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { company: userCompany, error: companyError } = await fetchUserCompany();
      
      if (companyError) {
        setError(companyError);
      } else {
        setCompany(userCompany);
        setError(null);
      }
    } catch (err) {
      console.error('Error refreshing company:', err);
      setError('Failed to refresh company information');
    } finally {
      setLoading(false);
    }
  };

  return {
    company,
    loading,
    error,
    refreshCompany
  };
};
