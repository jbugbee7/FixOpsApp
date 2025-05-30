
import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import ConnectionStatusBanner from '@/components/ConnectionStatusBanner';
import WorkOrdersList from '@/components/WorkOrdersList';
import type { Case } from '@/types/case';

interface DashboardCompletedOrdersProps {
  isOnline: boolean;
  hasOfflineData: boolean;
  cases: Case[];
  loading: boolean;
  isResyncing: boolean;
  displayName: string;
  onNavigate: (tab: string) => void;
  onModelFound: (model: any) => void;
  onPartFound: (part: any) => void;
  onCaseClick: (case_: Case) => void;
  onResync: () => void;
}

const DashboardCompletedOrders = React.memo(({
  isOnline,
  hasOfflineData,
  cases,
  loading,
  isResyncing,
  onCaseClick,
  onResync
}: DashboardCompletedOrdersProps) => {
  const completedCases = useMemo(() => 
    cases.filter(case_ => case_.status === 'Completed'), 
    [cases]
  );

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <ConnectionStatusBanner isOnline={isOnline} hasOfflineData={hasOfflineData} />

      {/* Completed Work Orders List */}
      <WorkOrdersList 
        cases={completedCases} 
        onCaseClick={onCaseClick} 
      />

      {/* Resync Button */}
      <div className="flex justify-center">
        <Button 
          onClick={onResync}
          disabled={isResyncing}
          variant="outline"
          className="flex items-center space-x-2 text-sm px-4 py-2"
          size="sm"
        >
          <RefreshCw className={`h-3 w-3 ${isResyncing ? 'animate-spin' : ''}`} />
          <span>
            {isResyncing 
              ? 'Syncing...' 
              : isOnline 
                ? 'Sync' 
                : 'Load Cache'
            }
          </span>
        </Button>
      </div>
    </div>
  );
});

DashboardCompletedOrders.displayName = 'DashboardCompletedOrders';

export default DashboardCompletedOrders;
