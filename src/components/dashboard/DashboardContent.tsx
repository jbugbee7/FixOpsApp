import DashboardMain from './DashboardMain';
import NewDashboardPage from './NewDashboardPage';
import FixChatPage from '@/components/FixChatPage';
import AiAssistantPage from '@/components/AiAssistantPage';
import TrainingPage from '@/components/TrainingPage';
import SettingsPage from '@/components/SettingsPage';
import CRMPage from './CRMPage';
import AccountingPage from './AccountingPage';
import InventoryPage from './InventoryPage';
import ModernCaseForm from '@/components/forms/ModernCaseForm';
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
  onResync
}: DashboardContentProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <NewDashboardPage />;
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
        return <ModernCaseForm />;
      case 'fixchat':
        return <FixChatPage />;
      case 'ai-assistant':
        return <AiAssistantPage />;
      case 'training':
        return <TrainingPage />;
      case 'crm':
        return <CRMPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'accounting':
        return <AccountingPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <NewDashboardPage />;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
