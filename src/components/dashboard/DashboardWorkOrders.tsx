
import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ConnectionStatusBanner from '@/components/ConnectionStatusBanner';
import WorkOrdersList from '@/components/WorkOrdersList';
import type { Case } from '@/types/case';

interface DashboardWorkOrdersProps {
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

const DashboardWorkOrders = React.memo(({
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
}: DashboardWorkOrdersProps) => {
  const activeCases = useMemo(() => 
    cases.filter(case_ => case_.status !== 'Completed'), 
    [cases]
  );

  return (
    <div className="space-y-6">
      {/* Search Bar - only shows active cases */}
      <SearchBar 
        onNavigate={onNavigate} 
        onModelFound={onModelFound}
        onPartFound={onPartFound}
        onCaseClick={onCaseClick}
        cases={activeCases}
      />

      {/* Add Button */}
      <div className="flex justify-center mb-6">
        <Button 
          onClick={() => onNavigate('add-case')}
          className="bg-gun-metal hover:bg-gun-metal/90 text-white px-8 py-6 text-base font-semibold w-full max-w-xs rounded-2xl shadow-lg shadow-gun-metal/30 hover:shadow-xl hover:shadow-gun-metal/40 transition-all duration-300"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Work Order
        </Button>
      </div>

      {/* Connection Status */}
      <ConnectionStatusBanner isOnline={isOnline} hasOfflineData={hasOfflineData} />

      {/* Work Orders List */}
      <WorkOrdersList 
        cases={activeCases} 
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

DashboardWorkOrders.displayName = 'DashboardWorkOrders';

export default DashboardWorkOrders;
