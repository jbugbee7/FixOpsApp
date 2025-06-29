import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { debounce } from 'lodash';

interface DashboardMetrics {
  totalWorkOrders: number;
  completionRate: number;
  monthlyRevenue: number;
  avgResponseTime: string;
  monthlyGrowth: number;
}

interface MonthlyData {
  month: string;
  workOrders: number;
  revenue: number;
  completion: number;
}

interface ServiceCategory {
  name: string;
  value: number;
  count: number;
  color: string;
}

export const useRealTimeDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalWorkOrders: 0,
    completionRate: 0,
    monthlyRevenue: 0,
    avgResponseTime: '0h',
    monthlyGrowth: 0
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDashboardMetrics = useCallback(async () => {
    try {
      console.log('Fetching real dashboard metrics...');
      
      // Get total work orders
      const { data: totalCases, error: casesError } = await supabase
        .from('cases')
        .select('id, status, created_at');

      if (casesError) throw casesError;

      const totalWorkOrders = totalCases?.length || 0;
      const completedCases = totalCases?.filter(c => c.status === 'Completed' || c.status === 'completed').length || 0;
      const completionRate = totalWorkOrders > 0 ? (completedCases / totalWorkOrders) * 100 : 0;

      // Calculate monthly revenue from invoices
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('total_amount, created_at')
        .gte('created_at', firstDayOfMonth.toISOString());

      if (invoicesError) throw invoicesError;

      const monthlyRevenue = invoices?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0;

      // Calculate growth (comparing to previous month)
      const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      const firstDayOfPreviousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 2, 1);
      
      const { data: previousInvoices } = await supabase
        .from('invoices')
        .select('total_amount')
        .gte('created_at', firstDayOfPreviousMonth.toISOString())
        .lt('created_at', firstDayOfMonth.toISOString());

      const previousRevenue = previousInvoices?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0;
      const monthlyGrowth = previousRevenue > 0 ? ((monthlyRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      setMetrics({
        totalWorkOrders,
        completionRate: Math.round(completionRate * 10) / 10,
        monthlyRevenue,
        avgResponseTime: '2.4h', // This would need more complex calculation
        monthlyGrowth: Math.round(monthlyGrowth * 10) / 10
      });

    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      setError('Failed to load dashboard metrics');
    }
  }, []);

  const fetchMonthlyTrends = useCallback(async () => {
    try {
      console.log('Fetching monthly trends...');
      
      // Get data for last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push({
          date,
          name: date.toLocaleDateString('en-US', { month: 'short' }),
          startOfMonth: new Date(date.getFullYear(), date.getMonth(), 1),
          endOfMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0)
        });
      }

      const monthlyTrends = await Promise.all(
        months.map(async (month) => {
          // Get work orders for this month
          const { data: cases } = await supabase
            .from('cases')
            .select('id, status')
            .gte('created_at', month.startOfMonth.toISOString())
            .lte('created_at', month.endOfMonth.toISOString());

          // Get revenue for this month
          const { data: invoices } = await supabase
            .from('invoices')
            .select('total_amount')
            .gte('created_at', month.startOfMonth.toISOString())
            .lte('created_at', month.endOfMonth.toISOString());

          const workOrders = cases?.length || 0;
          const revenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
          const completed = cases?.filter(c => c.status === 'Completed' || c.status === 'completed').length || 0;
          const completion = workOrders > 0 ? (completed / workOrders) * 100 : 0;

          return {
            month: month.name,
            workOrders,
            revenue,
            completion: Math.round(completion)
          };
        })
      );

      setMonthlyData(monthlyTrends);
    } catch (err) {
      console.error('Error fetching monthly trends:', err);
    }
  }, []);

  const fetchServiceCategories = useCallback(async () => {
    try {
      console.log('Fetching service categories...');
      
      const { data: cases } = await supabase
        .from('cases')
        .select('appliance_type');

      if (cases) {
        // Count by appliance type
        const categoryCount: { [key: string]: number } = {};
        cases.forEach(c => {
          const type = c.appliance_type || 'Other';
          categoryCount[type] = (categoryCount[type] || 0) + 1;
        });

        const total = cases.length;
        const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
        
        const categories = Object.entries(categoryCount)
          .map(([name, count], index) => ({
            name,
            value: total > 0 ? Math.round((count / total) * 100) : 0,
            count,
            color: colors[index % colors.length]
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setServiceCategories(categories);
      }
    } catch (err) {
      console.error('Error fetching service categories:', err);
    }
  }, []);

  // Debounced refetch for real-time updates
  const debouncedRefetch = useCallback(
    debounce(async () => {
      console.log('Real-time update: Refetching dashboard data');
      await Promise.all([
        fetchDashboardMetrics(),
        fetchMonthlyTrends(),
        fetchServiceCategories()
      ]);
    }, 500),
    [fetchDashboardMetrics, fetchMonthlyTrends, fetchServiceCategories]
  );

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      console.log('Initial dashboard data load');
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchDashboardMetrics(),
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
  }, [fetchDashboardMetrics, fetchMonthlyTrends, fetchServiceCategories]);

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
