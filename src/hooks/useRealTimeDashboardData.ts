
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { debounce } from 'lodash';
import { useDashboardMetrics } from './useDashboardMetrics';
import { useMonthlyTrends } from './useMonthlyTrends';
import { useServiceCategories } from './useServiceCategories';

export const useRealTimeDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { metrics, fetchMetrics } = useDashboardMetrics();
  const { monthlyData, fetchMonthlyTrends } = useMonthlyTrends();
  const { serviceCategories, fetchServiceCategories } = useServiceCategories();

  // Debounced refetch for real-time updates
  const debouncedRefetch = useCallback(
    debounce(async () => {
      console.log('Real-time update: Refetching dashboard data');
      try {
        await Promise.all([
          fetchMetrics(),
          fetchMonthlyTrends(),
          fetchServiceCategories()
        ]);
      } catch (err) {
        console.error('Error during real-time refetch:', err);
      }
    }, 500),
    [fetchMetrics, fetchMonthlyTrends, fetchServiceCategories]
  );

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      console.log('Initial dashboard data load');
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchMetrics(),
          fetchMonthlyTrends(),
          fetchServiceCategories()
        ]);
      } catch (err) {
        console.error('Initial dashboard data load error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchMetrics, fetchMonthlyTrends, fetchServiceCategories]);

  // Real-time subscriptions
  useEffect(() => {
    console.log('Setting up real-time subscriptions for dashboard data');
    
    const casesChannel = supabase
      .channel('dashboard-cases-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'cases'
      }, (payload) => {
        console.log('Real-time cases change:', payload.eventType, payload);
        debouncedRefetch();
      })
      .subscribe();

    const invoicesChannel = supabase
      .channel('dashboard-invoices-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'invoices'
      }, (payload) => {
        console.log('Real-time invoices change:', payload.eventType, payload);
        debouncedRefetch();
      })
      .subscribe();

    return () => {
      console.log('Cleaning up dashboard real-time subscriptions');
      supabase.removeChannel(casesChannel);
      supabase.removeChannel(invoicesChannel);
    };
  }, [debouncedRefetch]);

  return {
    metrics,
    monthlyData,
    serviceCategories,
    loading,
    error,
    refetch: debouncedRefetch
  };
};
