
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  created_at: string;
  updated_at: string;
}

interface Subscription {
  id: string;
  company_id: string;
  tier: 'free' | 'basic' | 'professional' | 'enterprise';
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  trial_end?: string;
}

interface CompanyContextType {
  company: Company | null;
  subscription: Subscription | null;
  loading: boolean;
  refreshCompany: () => Promise<void>;
  hasFeatureAccess: (featureName: string) => boolean;
  getFeatureLimit: (featureName: string) => number | null;
  checkUsageLimit: (featureName: string) => boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompanyData = async () => {
    if (!user) {
      setCompany(null);
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      // Get user's company
      const { data: companyData, error: companyError } = await supabase
        .from('company_users')
        .select(`
          company_id,
          companies (
            id,
            name,
            slug,
            logo_url,
            primary_color,
            secondary_color,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (companyError) {
        console.error('Error fetching company:', companyError);
        return;
      }

      const companyInfo = companyData.companies as Company;
      setCompany(companyInfo);

      // Get company's subscription
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('company_id', companyInfo.id)
        .single();

      if (subError) {
        console.error('Error fetching subscription:', subError);
      } else {
        setSubscription(subData);
      }
    } catch (error) {
      console.error('Error in fetchCompanyData:', error);
      toast({
        title: "Error Loading Company",
        description: "Failed to load company information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [user]);

  const refreshCompany = async () => {
    setLoading(true);
    await fetchCompanyData();
  };

  const hasFeatureAccess = (featureName: string): boolean => {
    if (!subscription) return false;
    
    // This is a simplified check - in a real app you'd call the Supabase function
    const tier = subscription.tier;
    
    // Basic feature access logic based on tier
    const featureMap: Record<string, string[]> = {
      free: ['work_orders_per_month', 'team_members'],
      basic: ['work_orders_per_month', 'team_members', 'ai_assistance'],
      professional: ['work_orders_per_month', 'team_members', 'ai_assistance', 'custom_branding', 'advanced_analytics', 'custom_workflows', 'priority_support'],
      enterprise: ['work_orders_per_month', 'team_members', 'ai_assistance', 'custom_branding', 'advanced_analytics', 'custom_workflows', 'priority_support', 'api_access', 'white_label', 'dedicated_support']
    };

    return featureMap[tier]?.includes(featureName) || false;
  };

  const getFeatureLimit = (featureName: string): number | null => {
    if (!subscription) return 0;
    
    const tier = subscription.tier;
    
    // Feature limits based on tier
    const limitMap: Record<string, Record<string, number | null>> = {
      free: { work_orders_per_month: 5, team_members: 1, ai_assistance: 0 },
      basic: { work_orders_per_month: 50, team_members: 5, ai_assistance: 10 },
      professional: { work_orders_per_month: null, team_members: 25, ai_assistance: null },
      enterprise: { work_orders_per_month: null, team_members: null, ai_assistance: null }
    };

    return limitMap[tier]?.[featureName] ?? 0;
  };

  const checkUsageLimit = (featureName: string): boolean => {
    // For now, return true - in production you'd check actual usage
    return hasFeatureAccess(featureName);
  };

  return (
    <CompanyContext.Provider value={{
      company,
      subscription,
      loading,
      refreshCompany,
      hasFeatureAccess,
      getFeatureLimit,
      checkUsageLimit
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
