
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import SearchBar from '@/components/SearchBar';
import ConnectionStatusBanner from '@/components/ConnectionStatusBanner';
import WorkOrdersList from '@/components/WorkOrdersList';
import type { Case } from '@/types/case';

interface DashboardMainProps {
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

const DashboardMain = React.memo(({
  isOnline,
  hasOfflineData,
  cases,
  loading,
  isResyncing,
  displayName,
  onNavigate,
  onModelFound,
  onPartFound,
  onCaseClick,
  onResync
}: DashboardMainProps) => {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 relative">
      <DashboardHeader />

      {/* Mobile-optimized Search Bar */}
      <div className="mb-6">
        <SearchBar 
          onNavigate={onNavigate} 
          onModelFound={onModelFound}
          onPartFound={onPartFound}
        />
      </div>

      {/* Mobile-optimized Add Button */}
      <div className="flex justify-center mb-6">
        <Button 
          onClick={() => onNavigate('add-case')}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-2.5 text-base font-semibold w-full max-w-xs"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Work Order
        </Button>
      </div>

      {/* Connection Status - Mobile optimized */}
      <ConnectionStatusBanner isOnline={isOnline} hasOfflineData={hasOfflineData} />

      {/* Work Orders List - Mobile optimized */}
      <WorkOrdersList 
        cases={cases} 
        loading={loading} 
        onCaseClick={onCaseClick} 
      />

      {/* Mobile-optimized Resync Button */}
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

DashboardMain.displayName = 'DashboardMain';

export default DashboardMain;
