
import { Tabs } from "@/components/ui/tabs";
import CaseDetails from '@/components/CaseDetails';
import ModelDetails from '@/components/ModelDetails';
import PartDetails from '@/components/PartDetails';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';
import TabContent from '@/components/dashboard/TabContent';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useBasicCaseOperations } from '@/hooks/useBasicCaseOperations';
import { useIndexState } from '@/hooks/useIndexState';
import { Skeleton } from '@/components/ui/skeleton';
import type { Case } from '@/types/case';

const Index = () => {
  const { user, userProfile, signOut, loading: authLoading } = useAuth();
  const isOnline = useNetworkStatus();
  
  console.log('Index render - authLoading:', authLoading, 'user:', user?.id);
  
  // Use basic operations only
  const { cases, loading: casesLoading, hasError, hasOfflineData, updateCaseStatus, handleResync } = useBasicCaseOperations(user, isOnline);
  
  console.log('Index render - casesLoading:', casesLoading, 'hasError:', hasError, 'cases count:', cases.length);
  
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
      // Force redirect even if sign out fails
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

  // Get display name - prioritize full name from profile, fallback to email
  const displayName = userProfile?.full_name || user?.email || 'User';

  // If user is not authenticated after auth loading is complete, redirect to auth
  if (!authLoading && !user) {
    console.log('No user found after auth loading, redirecting to auth');
    window.location.href = '/auth';
    return null;
  }

  // Show loading skeleton while auth is loading OR while initially loading cases (but not for database errors)
  const isInitialLoading = authLoading || (casesLoading && !hasError);
  
  console.log('Index render decision - isInitialLoading:', isInitialLoading);

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

  // Show loading skeleton only for initial loading (not for database errors)
  if (isInitialLoading) {
    console.log('Showing loading skeleton');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 dark:from-slate-900 dark:to-slate-800">
        <AppHeader 
          isOnline={isOnline} 
          onHomeClick={handleHomeClick} 
          onSignOut={handleSignOut} 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering main app interface');
  
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
            loading={false} // Pass false since we handle loading above
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
