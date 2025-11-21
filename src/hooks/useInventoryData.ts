
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const useInventoryData = () => {
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory items",
        variant: "destructive",
      });
    }
  };

  const fetchTransactions = async () => {
    // Transactions table doesn't exist yet
    setTransactions([]);
  };

  const fetchAlerts = async () => {
    // Alerts table doesn't exist yet
    setAlerts([]);
  };

  const refetch = async () => {
    setLoading(true);
    await Promise.all([fetchItems(), fetchTransactions(), fetchAlerts()]);
    setLoading(false);
  };

  useEffect(() => {
    refetch();

    // Set up real-time subscriptions
    const itemsChannel = supabase
      .channel('inventory-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_items'
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(itemsChannel);
    };
  }, []);

  return {
    items,
    transactions,
    alerts,
    loading,
    refetch
  };
};
