
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MonthlyData {
  month: string;
  workOrders: number;
  revenue: number;
  completion: number;
}

export const useMonthlyTrends = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  const fetchMonthlyTrends = useCallback(async () => {
    try {
      console.log('Fetching monthly trends...');
      
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
          const { data: cases } = await supabase
            .from('cases')
            .select('id, status')
            .gte('created_at', month.startOfMonth.toISOString())
            .lte('created_at', month.endOfMonth.toISOString());

          const { data: invoices } = await supabase
            .from('invoices')
            .select('total')
            .gte('created_at', month.startOfMonth.toISOString())
            .lte('created_at', month.endOfMonth.toISOString());

          const workOrders = cases?.length || 0;
          const revenue = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;
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
      throw err;
    }
  }, []);

  return { monthlyData, fetchMonthlyTrends };
};
