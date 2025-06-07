
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInventoryData } from '@/hooks/useInventoryData';
import { useInventoryOperations } from '@/hooks/useInventoryOperations';
import { useCRMData } from '@/hooks/useCRMData';

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTransactionDialog = ({ open, onClose, onSuccess }: AddTransactionDialogProps) => {
  const { items } = useInventoryData();
  const { allCustomers } = useCRMData();
  const { addTransaction } = useInventoryOperations();
  const [formData, setFormData] = useState({
    inventory_item_id: '',
    case_id: '',
    transaction_type: 'usage',
    quantity: 1,
    unit_cost: 0,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        inventory_item_id: '',
        case_id: '',
        transaction_type: 'usage',
        quantity: 1,
        unit_cost: 0,
        notes: ''
      });
    }
  }, [open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const transactionData = {
        ...formData,
        case_id: formData.case_id || null
      };
      await addTransaction(transactionData);
      onSuccess();
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="inventory_item_id">Inventory Item *</Label>
            <select
              id="inventory_item_id"
              value={formData.inventory_item_id}
              onChange={(e) => handleInputChange('inventory_item_id', e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_name} (Stock: {item.current_stock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="transaction_type">Transaction Type</Label>
            <select
              id="transaction_type"
              value={formData.transaction_type}
              onChange={(e) => handleInputChange('transaction_type', e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="usage">Usage</option>
              <option value="restock">Restock</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
              required
            />
          </div>

          {formData.transaction_type === 'restock' && (
            <div>
              <Label htmlFor="unit_cost">Unit Cost ($)</Label>
              <Input
                id="unit_cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.unit_cost}
                onChange={(e) => handleInputChange('unit_cost', parseFloat(e.target.value) || 0)}
              />
            </div>
          )}

          <div>
            <Label htmlFor="case_id">Related Work Order (Optional)</Label>
            <select
              id="case_id"
              value={formData.case_id}
              onChange={(e) => handleInputChange('case_id', e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">No work order</option>
              {allCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - Recent Service
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Optional notes about this transaction"
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Recording...' : 'Record Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
