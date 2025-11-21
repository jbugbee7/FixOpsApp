import { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Tables don't exist yet - return empty data
    setInventoryItems([]);
    setTransactions([]);
    setAlerts([]);
    setLoading(false);
  }, []);

  const createInventoryItem = async () => {
    console.log('Inventory item creation not yet implemented');
    return null;
  };

  const acknowledgeAlert = async () => {
    console.log('Alert acknowledgment not yet implemented');
    return false;
  };

  return {
    inventoryItems,
    transactions,
    alerts,
    loading,
    error,
    createInventoryItem,
    acknowledgeAlert,
    refetch: () => {},
  };
};
