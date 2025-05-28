
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import SearchBar from '@/components/SearchBar';
import ConnectionStatusBanner from '@/components/ConnectionStatusBanner';
import WorkOrdersList from '@/components/WorkOrdersList';
import UserInfoCard from '@/components/UserInfoCard';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <DashboardHeader />

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar 
          onNavigate={onNavigate} 
          onModelFound={onModelFound}
          onPartFound={onPartFound}
        />
      </div>

      {/* Connection Status Banner */}
      <ConnectionStatusBanner isOnline={isOnline} hasOfflineData={hasOfflineData} />

      {/* Recent Work Orders - Centered */}
      <WorkOrdersList 
        cases={cases} 
        loading={loading} 
        onCaseClick={onCaseClick} 
      />

      {/* Resync Button - Bottom Center */}
      <div className="flex justify-center mt-8">
        <Button 
          onClick={onResync}
          disabled={isResyncing}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isResyncing ? 'animate-spin' : ''}`} />
          <span>
            {isResyncing 
              ? 'Resyncing...' 
              : isOnline 
                ? 'Resync Data' 
                : 'Load Cached Data'
            }
          </span>
        </Button>
      </div>

      {/* User Info - Bottom Right with name instead of email */}
      <UserInfoCard displayName={displayName} />
    </div>
  );
});

DashboardMain.displayName = 'DashboardMain';

export default DashboardMain;
