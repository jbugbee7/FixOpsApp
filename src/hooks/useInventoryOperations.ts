
import { supabase } from '@/lib/supabaseClient';
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
    // Transactions table doesn't exist yet
    console.log('Transaction would be recorded:', transactionData);
    toast({
      title: "Info",
      description: "Transaction recording not yet implemented",
    });
  };

  const acknowledgeAlert = async (alertId: string) => {
    // Alerts table doesn't exist yet
    console.log('Alert would be acknowledged:', alertId);
    toast({
      title: "Info",
      description: "Alert acknowledgement not yet implemented",
    });
  };

  return {
    addItem,
    updateItem,
    deleteItem,
    addTransaction,
    acknowledgeAlert
  };
};
