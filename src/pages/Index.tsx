
import { Tabs } from "@/components/ui/tabs";
import CaseDetails from '@/components/CaseDetails';
import ModelDetails from '@/components/ModelDetails';
import PartDetails from '@/components/PartDetails';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';
import TabContent from '@/components/dashboard/TabContent';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useCompanyCaseOperations } from '@/hooks/useCompanyCaseOperations';
import { useIndexState } from '@/hooks/useIndexState';

const Index = () => {
  const { user, userProfile, signOut } = useAuth();
  const isOnline = useNetworkStatus();
  const { cases, loading, hasOfflineData, updateCaseStatus, handleResync } = useCompanyCaseOperations(user, isOnline);
  
  const {
    selectedCase,
    selectedModel,
    selectedPart,
    activeTab,
    isResyncing,
    setActiveTab,
    setIsResyncing,
    handleCaseClick,
    handleModelFound,
    handlePartFound,
    handleHomeClick,
    handleNavigate
  } = useIndexState();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleResyncWrapper = async () => {
    setIsResyncing(true);
    try {
      await handleResync();
    } finally {
      setIsResyncing(false);
    }
  };

  // Get display name - prioritize full name from profile, fallback to email
  const displayName = userProfile?.full_name || user?.email || 'User';

  if (selectedCase) {
    return (
      <CaseDetails 
        case={selectedCase} 
        onBack={() => handleCaseClick(null as any)} 
        onStatusUpdate={updateCaseStatus}
      />
    );
  }

  if (selectedModel) {
    return (
      <ModelDetails 
        model={selectedModel} 
        onBack={() => handleModelFound(null)} 
      />
    );
  }

  if (selectedPart) {
    return (
      <PartDetails 
        part={selectedPart} 
        onBack={() => handlePartFound(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <AppHeader 
        isOnline={isOnline} 
        onHomeClick={handleHomeClick} 
        onSignOut={handleSignOut} 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex-1">
          <TabContent
            isOnline={isOnline}
            hasOfflineData={hasOfflineData}
            cases={cases}
            loading={loading}
            isResyncing={isResyncing}
            displayName={displayName}
            onNavigate={handleNavigate}
            onModelFound={handleModelFound}
            onPartFound={handlePartFound}
            onCaseClick={handleCaseClick}
            onResync={handleResyncWrapper}
          />
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </Tabs>
    </div>
  );
};

export default Index;
