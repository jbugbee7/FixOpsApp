
import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSubTabs from './DashboardSubTabs';
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

const DashboardMain = React.memo((props: DashboardMainProps) => {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 relative">
      <DashboardHeader />
      <DashboardSubTabs {...props} />
    </div>
  );
});

DashboardMain.displayName = 'DashboardMain';

export default DashboardMain;
