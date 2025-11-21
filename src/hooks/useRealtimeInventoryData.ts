
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Tables don't exist yet - return empty data
  useEffect(() => {
    setLoading(false);
  }, []);

  const createInventoryItem = async (itemData: any) => {
    console.log('Inventory item creation not yet implemented:', itemData);
    toast({
      title: 'Info',
      description: 'Inventory management not yet implemented',
    });
    return null;
  };

  const acknowledgeAlert = async (alertId: string) => {
    console.log('Alert acknowledgement not yet implemented:', alertId);
    return false;
  };

  const refetch = () => {
    // No-op since tables don't exist
  };

  return {
    inventoryItems,
    transactions,
    alerts,
    loading,
    error,
    createInventoryItem,
    acknowledgeAlert,
    refetch,
  };
};
