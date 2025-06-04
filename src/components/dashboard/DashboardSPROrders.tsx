
import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ConnectionStatusBanner from '@/components/ConnectionStatusBanner';
import WorkOrdersList from '@/components/WorkOrdersList';
import type { Case } from '@/types/case';

interface DashboardSPROrdersProps {
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

const DashboardSPROrders = React.memo(({
  isOnline,
  hasOfflineData,
  cases,
  loading,
  isResyncing,
  onNavigate,
  onModelFound,
  onPartFound,
  onCaseClick,
  onResync
}: DashboardSPROrdersProps) => {
  const sprCases = useMemo(() => 
    cases.filter(case_ => case_.spt_status === 'spr'), 
    [cases]
  );

  return (
    <div className="space-y-6">
      {/* Search Bar - only shows SPR cases */}
      <SearchBar 
        onNavigate={onNavigate} 
        onModelFound={onModelFound}
        onPartFound={onPartFound}
        onCaseClick={onCaseClick}
        cases={sprCases}
      />

      {/* Connection Status */}
      <ConnectionStatusBanner isOnline={isOnline} hasOfflineData={hasOfflineData} />

      {/* SPR Work Orders List */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Scheduled Part Returns
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Work orders waiting for parts to arrive
          </p>
        </div>
        
        <WorkOrdersList 
          cases={sprCases} 
          onCaseClick={onCaseClick} 
        />
      </div>

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

DashboardSPROrders.displayName = 'DashboardSPROrders';

export default DashboardSPROrders;
