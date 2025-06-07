
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { debounce } from 'lodash';

interface InventoryItem {
  id: string;
  user_id: string;
  item_name: string;
  item_number?: string;
  category: string;
  current_stock: number;
  minimum_stock: number;
  unit_cost: number;
  location?: string;
  supplier?: string;
  created_at: string;
  updated_at: string;
}

interface InventoryTransaction {
  id: string;
  inventory_item_id: string;
  user_id: string;
  transaction_type: string;
  quantity: number;
  unit_cost?: number;
  case_id?: string;
  notes?: string;
  created_at: string;
}

interface ReorderAlert {
  id: string;
  inventory_item_id: string;
  user_id: string;
  alert_level: string;
  message: string;
  is_acknowledged?: boolean;
  acknowledged_at?: string;
  created_at: string;
}

export const useRealtimeInventoryData = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [alerts, setAlerts] = useState<ReorderAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch functions
  const fetchInventoryItems = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('item_name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch inventory items:', err);
      return [];
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Limit to last 100 transactions

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      return [];
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reorder_alerts')
        .select('*')
        .eq('is_acknowledged', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      return [];
    }
  }, []);

  // Debounced refetch for real-time updates
  const debouncedRefetch = useCallback(
    debounce(async () => {
      console.log('Real-time update: Refetching inventory data');
      try {
        const [itemsData, transactionsData, alertsData] = await Promise.all([
          fetchInventoryItems(),
          fetchTransactions(),
          fetchAlerts()
        ]);
        
        setInventoryItems(itemsData);
        setTransactions(transactionsData);
        setAlerts(alertsData);
        setError(null);
      } catch (err) {
        console.error('Real-time inventory refetch error:', err);
        setError('Failed to sync inventory data');
      }
    }, 300),
    [fetchInventoryItems, fetchTransactions, fetchAlerts]
  );

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      console.log('Initial inventory data load');
      setLoading(true);
      setError(null);
      
      try {
        const [itemsData, transactionsData, alertsData] = await Promise.all([
          fetchInventoryItems(),
          fetchTransactions(),
          fetchAlerts()
        ]);
        
        setInventoryItems(itemsData);
        setTransactions(transactionsData);
        setAlerts(alertsData);
      } catch (err) {
        console.error('Initial inventory data load error:', err);
        setError('Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchInventoryItems, fetchTransactions, fetchAlerts]);

  // Real-time subscriptions
  useEffect(() => {
    console.log('Setting up real-time subscriptions for inventory data');
    
    const itemsChannel = supabase
      .channel('inventory-items-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'inventory_items'
      }, (payload) => {
        console.log('Real-time inventory items change:', payload.eventType, payload);
        debouncedRefetch();
      })
      .subscribe((status) => {
        console.log('Inventory items channel status:', status);
      });

    const transactionsChannel = supabase
      .channel('inventory-transactions-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'inventory_transactions'
      }, (payload) => {
        console.log('Real-time inventory transactions change:', payload.eventType, payload);
        debouncedRefetch();
      })
      .subscribe((status) => {
        console.log('Inventory transactions channel status:', status);
      });

    const alertsChannel = supabase
      .channel('reorder-alerts-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reorder_alerts'
      }, (payload) => {
        console.log('Real-time reorder alerts change:', payload.eventType, payload);
        debouncedRefetch();
      })
      .subscribe((status) => {
        console.log('Reorder alerts channel status:', status);
      });

    return () => {
      console.log('Cleaning up inventory real-time subscriptions');
      supabase.removeChannel(itemsChannel);
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, [debouncedRefetch]);

  // Create inventory item
  const createInventoryItem = async (itemData: {
    item_name: string;
    item_number?: string;
    category?: string;
    current_stock?: number;
    minimum_stock?: number;
    unit_cost?: number;
    location?: string;
    supplier?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        toast({
          title: 'Error',
          description: 'User not authenticated',
          variant: 'destructive',
        });
        return null;
      }

      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          item_name: itemData.item_name,
          item_number: itemData.item_number,
          category: itemData.category || 'parts',
          current_stock: itemData.current_stock || 0,
          minimum_stock: itemData.minimum_stock || 5,
          unit_cost: itemData.unit_cost || 0,
          location: itemData.location || 'van',
          supplier: itemData.supplier,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Inventory item created successfully',
      });
      
      return data;
    } catch (err) {
      console.error('Failed to create inventory item:', err);
      toast({
        title: 'Error',
        description: 'Failed to create inventory item',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Acknowledge alert
  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('reorder_alerts')
        .update({ 
          is_acknowledged: true, 
          acknowledged_at: new Date().toISOString() 
        })
        .eq('id', alertId);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Alert acknowledged',
      });
      
      return true;
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
      toast({
        title: 'Error',
        description: 'Failed to acknowledge alert',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    inventoryItems,
    transactions,
    alerts,
    loading,
    error,
    createInventoryItem,
    acknowledgeAlert,
    refetch: debouncedRefetch,
  };
};
