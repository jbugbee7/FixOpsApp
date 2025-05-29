
import { Tabs } from "@/components/ui/tabs";
import CaseDetails from '@/components/CaseDetails';
import ModelDetails from '@/components/ModelDetails';
import PartDetails from '@/components/PartDetails';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';
import TabContent from '@/components/dashboard/TabContent';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOptimizedCaseOperations } from '@/hooks/useOptimizedCaseOperations';
import { useIndexState } from '@/hooks/useIndexState';
import { Skeleton } from '@/components/ui/skeleton';
import type { Case } from '@/types/case';

const Index = () => {
  const { user, userProfile, signOut, loading: authLoading } = useAuth();
  const isOnline = useNetworkStatus();
  
  const { cases, loading: casesLoading, hasError, hasOfflineData, updateCaseStatus, handleResync } = useOptimizedCaseOperations(user, isOnline);
  
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
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = '/auth';
    }
  };

  const handleResyncWrapper = async () => {
    setIsResyncing(true);
    try {
      await handleResync();
    } catch (error) {
      console.error('Error during resync:', error);
    } finally {
      setIsResyncing(false);
    }
  };

  const displayName = userProfile?.full_name || user?.email || 'User';

  // Faster redirect without loading state
  if (!authLoading && !user) {
    window.location.href = '/auth';
    return null;
  }

  // Handle selected states with optimized rendering
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

  // Simplified loading state - only show when absolutely necessary
  const showLoading = authLoading || (casesLoading && cases.length === 0 && !hasError);

  if (showLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 dark:from-slate-900 dark:to-slate-800">
        <AppHeader 
          isOnline={isOnline} 
          onHomeClick={handleHomeClick} 
          onSignOut={handleSignOut} 
        />
        
        <div className="max-w-4xl mx-auto px-3 py-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4 rounded" />
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 dark:from-slate-900 dark:to-slate-800">
      <AppHeader 
        isOnline={isOnline} 
        onHomeClick={handleHomeClick} 
        onSignOut={handleSignOut} 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex-1 px-1 sm:px-0">
          <TabContent
            isOnline={isOnline}
            hasOfflineData={hasOfflineData}
            cases={cases}
            loading={casesLoading}
            isResyncing={isResyncing}
            displayName={displayName}
            onNavigate={handleNavigate}
            onModelFound={handleModelFound}
            onPartFound={handlePartFound}
            onCaseClick={handleCaseClick}
            onResync={handleResyncWrapper}
          />
        </div>

        <BottomNavigation />
      </Tabs>
    </div>
  );
};

export default Index;
