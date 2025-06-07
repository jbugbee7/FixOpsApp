
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package, Edit, Trash2 } from 'lucide-react';
import AddInventoryItemDialog from './AddInventoryItemDialog';
import EditInventoryItemDialog from './EditInventoryItemDialog';

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

interface InventoryItemsProps {
  items: InventoryItem[];
  loading: boolean;
  onCreateItem: (itemData: Partial<InventoryItem>) => Promise<any>;
}

const InventoryItems = ({ items, loading, onCreateItem }: InventoryItemsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.item_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      // Delete functionality would go here
      console.log('Delete item:', itemId);
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.current_stock <= 0) return { label: 'Out of Stock', color: 'bg-red-500' };
    if (item.current_stock <= item.minimum_stock) return { label: 'Low Stock', color: 'bg-orange-500' };
    return { label: 'In Stock', color: 'bg-green-500' };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Categories</option>
            <option value="parts">Parts</option>
            <option value="tools">Tools</option>
            <option value="materials">Materials</option>
          </select>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item);
          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.item_name}</CardTitle>
                    {item.item_number && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">#{item.item_number}</p>
                    )}
                  </div>
                  <Package className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stock:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.current_stock}</span>
                    <Badge variant="outline" className={`${stockStatus.color} text-white border-0`}>
                      {stockStatus.label}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="capitalize">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Cost:</span>
                    <span>${item.unit_cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Stock:</span>
                    <span>{item.minimum_stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="capitalize">{item.location}</span>
                  </div>
                  {item.supplier && (
                    <div className="flex justify-between">
                      <span>Supplier:</span>
                      <span>{item.supplier}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No items found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {searchTerm ? 'No items match your search.' : 'Get started by adding your first inventory item.'}
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <AddInventoryItemDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={() => {
          setShowAddDialog(false);
        }}
      />

      {editingItem && (
        <EditInventoryItemDialog
          item={editingItem}
          open={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default InventoryItems;
