
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingDown, AlertTriangle, Activity, Box, Archive } from 'lucide-react';
import InventoryOverview from './inventory/InventoryOverview';
import InventoryItems from './inventory/InventoryItems';
import InventoryTransactions from './inventory/InventoryTransactions';
import ReorderAlerts from './inventory/ReorderAlerts';
import { useRealtimeInventoryData } from '@/hooks/useRealtimeInventoryData';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const totalValue = inventoryItems?.reduce((sum, item) => sum + ((item.current_stock || 0) * (item.unit_cost || 0)), 0) || 0;
  const lowStockCount = inventoryItems?.filter(item => (item.current_stock || 0) <= (item.minimum_stock || 0)).length || 0;

  // Mobile view (keep existing simple design)
  if (isMobile) {
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
  }

  // Desktop view (new detailed design)
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-shrink-0 border-b">
        <div className="max-w-7xl mx-auto px-6 py-1.5">
          <h1 className="text-xl font-bold mb-0">Inventory Management</h1>
          <p className="text-xs text-muted-foreground">Track parts, manage stock levels, and monitor inventory transactions</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="col-span-8 space-y-6">
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

            {/* Right Column - Sidebar Info */}
            <div className="col-span-4 space-y-6">
              {/* Inventory Summary */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Inventory Summary</CardTitle>
                  <CardDescription>Current stock status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="h-5 w-5 text-primary" />
                      <Badge variant="secondary">{inventoryItems?.length || 0}</Badge>
                    </div>
                    <div className="text-2xl font-bold">${(totalValue / 1000).toFixed(1)}k</div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingDown className="h-5 w-5 text-destructive" />
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="text-2xl font-bold">{lowStockCount}</div>
                    <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                    <div className="flex items-center justify-between mb-2">
                      <Activity className="h-5 w-5 text-accent" />
                      <Badge variant="secondary">{transactions?.length || 0}</Badge>
                    </div>
                    <div className="text-2xl font-bold">{transactions?.slice(0, 30).length || 0}</div>
                    <p className="text-sm text-muted-foreground">Recent Transactions</p>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card className="rounded-2xl border-border/50 border-destructive/30 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Active Alerts
                  </CardTitle>
                  <CardDescription>Items requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.slice(0, 3).map((alert, index) => (
                    <div key={index} className="p-3 rounded-lg border border-destructive/20 bg-background">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">Alert level: {alert.alert_level}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Box className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Add new item</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Archive className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Stock adjustment</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium">Generate report</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
