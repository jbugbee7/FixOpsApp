
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardMetrics {
  totalWorkOrders: number;
  completionRate: number;
  monthlyRevenue: number;
  avgResponseTime: string;
  monthlyGrowth: number;
}

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalWorkOrders: 0,
    completionRate: 0,
    monthlyRevenue: 0,
    avgResponseTime: '0h',
    monthlyGrowth: 0
  });

  const fetchMetrics = useCallback(async () => {
    try {
      console.log('Fetching dashboard metrics...');
      
      const { data: totalCases, error: casesError } = await supabase
        .from('cases')
        .select('id, status, created_at');

      if (casesError) throw casesError;

      const totalWorkOrders = totalCases?.length || 0;
      const completedCases = totalCases?.filter(c => c.status === 'Completed' || c.status === 'completed').length || 0;
      const completionRate = totalWorkOrders > 0 ? (completedCases / totalWorkOrders) * 100 : 0;

      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('total_amount, created_at')
        .gte('created_at', firstDayOfMonth.toISOString());

      if (invoicesError) throw invoicesError;

      const monthlyRevenue = invoices?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0;

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
        avgResponseTime: '2.4h',
        monthlyGrowth: Math.round(monthlyGrowth * 10) / 10
      });

    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      throw err;
    }
  }, []);

  return { metrics, fetchMetrics };
};
