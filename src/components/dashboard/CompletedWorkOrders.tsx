
import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import ConnectionStatusBanner from '@/components/ConnectionStatusBanner';
import WorkOrdersList from '@/components/WorkOrdersList';
import type { Case } from '@/types/case';

interface CompletedWorkOrdersProps {
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

const CompletedWorkOrders = React.memo(({
  isOnline,
  hasOfflineData,
  cases,
  loading,
  isResyncing,
  onCaseClick,
  onResync
}: CompletedWorkOrdersProps) => {
  const completedCases = useMemo(() => 
    cases.filter(case_ => case_.status === 'Completed'), 
    [cases]
  );

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 relative">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Completed Work Orders
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          View all your completed work orders
        </p>
      </div>

      {/* Connection Status */}
      <ConnectionStatusBanner isOnline={isOnline} hasOfflineData={hasOfflineData} />

      {/* Completed Work Orders List */}
      <WorkOrdersList 
        cases={completedCases} 
        loading={loading} 
        onCaseClick={onCaseClick} 
      />

      {/* Resync Button */}
      <div className="flex justify-center mt-6">
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

CompletedWorkOrders.displayName = 'CompletedWorkOrders';

export default CompletedWorkOrders;
