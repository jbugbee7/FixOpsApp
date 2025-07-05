
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryOverview from './inventory/InventoryOverview';
import InventoryItems from './inventory/InventoryItems';
import InventoryTransactions from './inventory/InventoryTransactions';
import ReorderAlerts from './inventory/ReorderAlerts';
import { useRealtimeInventoryData } from '@/hooks/useRealtimeInventoryData';

const InventoryPage = () => {
  const { 
    inventoryItems, 
    transactions, 
    alerts, 
    loading, 
    error, 
    createInventoryItem,
    acknowledgeAlert 
  } = useRealtimeInventoryData();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="flex-shrink-0 border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-6 h-full">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="alerts">
                Alerts {alerts.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">{alerts.length}</span>}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 mt-6 overflow-hidden">
              <TabsContent value="overview" className="h-full">
                <InventoryOverview 
                  items={inventoryItems} 
                  transactions={transactions} 
                  alerts={alerts}
                  loading={loading} 
                />
              </TabsContent>
              
              <TabsContent value="items" className="h-full">
                <InventoryItems 
                  items={inventoryItems} 
                  loading={loading}
                  onCreateItem={createInventoryItem}
                />
              </TabsContent>
              
              <TabsContent value="transactions" className="h-full">
                <InventoryTransactions 
                  transactions={transactions} 
                  loading={loading} 
                />
              </TabsContent>
              
              <TabsContent value="alerts" className="h-full">
                <ReorderAlerts 
                  alerts={alerts} 
                  loading={loading}
                  onAcknowledgeAlert={acknowledgeAlert}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
