
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select(`
          *,
          inventory_item:inventory_items(item_name),
          case:cases(wo_number, customer_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    }
  };

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('reorder_alerts')
        .select(`
          *,
          inventory_item:inventory_items(item_name, current_stock, minimum_stock)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load alerts",
        variant: "destructive",
      });
    }
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

    const transactionsChannel = supabase
      .channel('inventory-transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_transactions'
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    const alertsChannel = supabase
      .channel('reorder-alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reorder_alerts'
        },
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(itemsChannel);
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(alertsChannel);
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
