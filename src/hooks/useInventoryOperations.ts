
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useInventoryOperations = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const addItem = async (itemData: any) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          ...itemData,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory item added successfully",
      });

      return data;
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to add inventory item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateItem = async (itemId: string, itemData: any) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(itemData)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory item updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to update inventory item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to delete inventory item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addTransaction = async (transactionData: any) => {
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .insert({
          ...transactionData,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction recorded successfully",
      });

      return data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to record transaction",
        variant: "destructive",
      });
      throw error;
    }
  };

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
        title: "Success",
        description: "Alert acknowledged",
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge alert",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    addItem,
    updateItem,
    deleteItem,
    addTransaction,
    acknowledgeAlert
  };
};
