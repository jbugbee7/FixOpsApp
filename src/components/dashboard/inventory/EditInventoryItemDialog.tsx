
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInventoryOperations } from '@/hooks/useInventoryOperations';

interface EditInventoryItemDialogProps {
  item: any;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditInventoryItemDialog = ({ item, open, onClose, onSuccess }: EditInventoryItemDialogProps) => {
  const { updateItem } = useInventoryOperations();
  const [formData, setFormData] = useState({
    item_name: '',
    item_number: '',
    category: 'parts',
    current_stock: 0,
    minimum_stock: 5,
    unit_cost: 0,
    supplier: '',
    location: 'van'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        item_name: item.item_name || '',
        item_number: item.item_number || '',
        category: item.category || 'parts',
        current_stock: item.current_stock || 0,
        minimum_stock: item.minimum_stock || 5,
        unit_cost: item.unit_cost || 0,
        supplier: item.supplier || '',
        location: item.location || 'van'
      });
    }
  }, [item]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateItem(item.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="item_name">Item Name *</Label>
            <Input
              id="item_name"
              value={formData.item_name}
              onChange={(e) => handleInputChange('item_name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="item_number">Item Number</Label>
            <Input
              id="item_number"
              value={formData.item_number}
              onChange={(e) => handleInputChange('item_number', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="parts">Parts</option>
              <option value="tools">Tools</option>
              <option value="materials">Materials</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_stock">Current Stock</Label>
              <Input
                id="current_stock"
                type="number"
                min="0"
                value={formData.current_stock}
                onChange={(e) => handleInputChange('current_stock', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="minimum_stock">Minimum Stock</Label>
              <Input
                id="minimum_stock"
                type="number"
                min="0"
                value={formData.minimum_stock}
                onChange={(e) => handleInputChange('minimum_stock', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

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

          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <select
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="van">Van</option>
              <option value="shop">Shop</option>
              <option value="warehouse">Warehouse</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Updating...' : 'Update Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInventoryItemDialog;
