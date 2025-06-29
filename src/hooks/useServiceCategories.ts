
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ServiceCategory {
  name: string;
  value: number;
  count: number;
  color: string;
}

export const useServiceCategories = () => {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);

  const fetchServiceCategories = useCallback(async () => {
    try {
      console.log('Fetching service categories...');
      
      const { data: cases } = await supabase
        .from('cases')
        .select('appliance_type');

      if (cases) {
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
      throw err;
    }
  }, []);

  return { serviceCategories, fetchServiceCategories };
};
