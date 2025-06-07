
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInventoryData } from '@/hooks/useInventoryData';
import { Plus, ArrowUpCircle, ArrowDownCircle, Settings, ExternalLink } from 'lucide-react';
import AddTransactionDialog from './AddTransactionDialog';

const InventoryTransactions = () => {
  const { transactions, loading, refetch } = useInventoryData();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'usage':
        return <ArrowDownCircle className="h-4 w-4 text-red-500" />;
      case 'restock':
        return <ArrowUpCircle className="h-4 w-4 text-green-500" />;
      case 'adjustment':
        return <Settings className="h-4 w-4 text-blue-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'usage':
        return 'bg-red-100 text-red-800';
      case 'restock':
        return 'bg-green-100 text-green-800';
      case 'adjustment':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Inventory Transactions</h2>
          <p className="text-slate-600 dark:text-slate-400">Track usage, restocking, and adjustments</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Record Transaction
        </Button>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getTransactionIcon(transaction.transaction_type)}
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {transaction.inventory_item?.item_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTransactionColor(transaction.transaction_type)}>
                        {transaction.transaction_type}
                      </Badge>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Quantity: {transaction.quantity}
                      </span>
                      {transaction.unit_cost > 0 && (
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Unit Cost: ${transaction.unit_cost}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(transaction.created_at).toLocaleTimeString()}
                  </p>
                  {transaction.case && (
                    <div className="flex items-center gap-1 mt-1">
                      <ExternalLink className="h-3 w-3" />
                      <span className="text-xs text-blue-600">
                        WO: {transaction.case.wo_number}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {transaction.notes && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Notes:</span> {transaction.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {transactions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No transactions yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Start recording inventory transactions to track usage and restocking.
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Record First Transaction
            </Button>
          </CardContent>
        </Card>
      )}

      <AddTransactionDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={() => {
          setShowAddDialog(false);
          refetch();
        }}
      />
    </div>
  );
};

export default InventoryTransactions;
