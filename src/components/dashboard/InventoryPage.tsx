
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryOverview from './inventory/InventoryOverview';
import InventoryItems from './inventory/InventoryItems';
import InventoryTransactions from './inventory/InventoryTransactions';
import ReorderAlerts from './inventory/ReorderAlerts';
import { Package, History, AlertTriangle, BarChart3 } from 'lucide-react';

const InventoryPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Inventory Tracker</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your van and shop inventory, track usage, and monitor stock levels</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <InventoryOverview />
        </TabsContent>

        <TabsContent value="items">
          <InventoryItems />
        </TabsContent>

        <TabsContent value="transactions">
          <InventoryTransactions />
        </TabsContent>

        <TabsContent value="alerts">
          <ReorderAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryPage;
