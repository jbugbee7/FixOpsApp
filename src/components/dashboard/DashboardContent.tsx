import DashboardMain from './DashboardMain';
import NewDashboardPage from './NewDashboardPage';
import FixChatPage from '@/components/FixChatPage';
import TrainingPage from '@/components/TrainingPage';
import SettingsPage from '@/components/SettingsPage';
import CRMPage from './CRMPage';
import AccountingPage from './AccountingPage';
import InventoryPage from './InventoryPage';
import SchedulingPage from './SchedulingPage';
import ModernCaseForm from '@/components/forms/ModernCaseForm';
import MobileAnalyticsPage from './mobile/MobileAnalyticsPage';
import MobileCRMPage from './mobile/MobileCRMPage';
import MobileAccountingPage from './mobile/MobileAccountingPage';
import { Case } from '@/types/case';

interface DashboardContentProps {
  activeTab: string;
  isOnline: boolean;
  hasOfflineData: boolean;
  cases: Case[];
  loading: boolean;
  isResyncing: boolean;
  displayName: string;
  onNavigate: (tab: string) => void;
  onModelFound: (model: any) => void;
  onPartFound: (part: any) => void;
  onCaseClick: (caseItem: Case) => void;
  onResync: () => void;
  previousTab?: string;
}

const DashboardContent = ({
  activeTab,
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
  onResync,
  previousTab
}: DashboardContentProps) => {
  const cameFromDashboard = previousTab === 'dashboard';
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <NewDashboardPage onNavigate={onNavigate} />;
      case 'work-order':
        return (
          <DashboardMain
            isOnline={isOnline}
            hasOfflineData={hasOfflineData}
            cases={cases}
            loading={loading}
            isResyncing={isResyncing}
            displayName={displayName}
            onNavigate={onNavigate}
            onModelFound={onModelFound}
            onPartFound={onPartFound}
            onCaseClick={onCaseClick}
            onResync={onResync}
          />
        );
      case 'add-case':
        return <ModernCaseForm fromDashboard={cameFromDashboard} onNavigate={onNavigate} />;
      case 'fixchat':
        return <FixChatPage />;
      case 'training':
        return <TrainingPage />;
      case 'crm':
        return <CRMPage fromDashboard={cameFromDashboard} onNavigate={onNavigate} />;
      case 'inventory':
        return <InventoryPage />;
      case 'accounting':
        return <AccountingPage fromDashboard={cameFromDashboard} onNavigate={onNavigate} />;
      case 'scheduling':
        return <SchedulingPage />;
      case 'settings':
        return <SettingsPage onNavigate={onNavigate} />;
      case 'mobile-analytics':
        return <MobileAnalyticsPage />;
      case 'mobile-crm':
        return <MobileCRMPage />;
      case 'mobile-accounting':
        return <MobileAccountingPage />;
      default:
        return <NewDashboardPage onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
