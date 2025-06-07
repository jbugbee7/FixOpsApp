
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInventoryData } from '@/hooks/useInventoryData';
import { useInventoryOperations } from '@/hooks/useInventoryOperations';
import { AlertTriangle, Check, Package } from 'lucide-react';

const ReorderAlerts = () => {
  const { alerts, loading, refetch } = useInventoryData();
  const { acknowledgeAlert } = useInventoryOperations();

  const handleAcknowledge = async (alertId: string) => {
    await acknowledgeAlert(alertId);
    refetch();
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.is_acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.is_acknowledged);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
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
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reorder Alerts</h2>
        <p className="text-slate-600 dark:text-slate-400">Monitor low stock levels and reorder notifications</p>
      </div>

      {/* Active Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Alerts ({unacknowledgedAlerts.length})
          </h3>
          {unacknowledgedAlerts.map((alert) => (
            <Card key={alert.id} className="border-red-200 bg-red-50 dark:bg-red-900/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                        {alert.inventory_item?.item_name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-red-600 border-red-300">
                          Current: {alert.inventory_item?.current_stock}
                        </Badge>
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Min: {alert.inventory_item?.minimum_stock}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => handleAcknowledge(alert.id)}
                      className="mt-2"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Acknowledge
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Check className="h-5 w-5" />
            Acknowledged Alerts ({acknowledgedAlerts.length})
          </h3>
          {acknowledgedAlerts.map((alert) => (
            <Card key={alert.id} className="border-slate-200 bg-slate-50 dark:bg-slate-800/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Check className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                        {alert.inventory_item?.item_name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-slate-600 border-slate-300">
                          Current: {alert.inventory_item?.current_stock}
                        </Badge>
                        <Badge variant="outline" className="text-slate-600 border-slate-300">
                          Min: {alert.inventory_item?.minimum_stock}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Acknowledged: {new Date(alert.acknowledged_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      Created: {new Date(alert.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Alerts */}
      {alerts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No alerts</h3>
            <p className="text-slate-600 dark:text-slate-400">
              All inventory items are at sufficient stock levels.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReorderAlerts;
