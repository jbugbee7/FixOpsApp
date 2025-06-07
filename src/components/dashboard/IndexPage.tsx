
import { SidebarProvider } from "@/components/ui/sidebar";
import CaseDetails from '@/components/CaseDetails';
import ModelDetails from '@/components/ModelDetails';
import PartDetails from '@/components/PartDetails';
import AppHeader from '@/components/AppHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Skeleton } from '@/components/ui/skeleton';
import { IndexPageProps } from '@/types/indexPage';

const IndexPage = ({
  user,
  userProfile,
  signOut,
  authLoading,
  isOnline,
  cases,
  loading: casesLoading,
  hasOfflineData,
  updateCaseStatus,
  handleResync,
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
}: IndexPageProps) => {
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

  // Enhanced navigation handler to use setActiveTab for specific tabs
  const handleEnhancedNavigate = (tab: string) => {
    if (tab === 'add-case') {
      setActiveTab('add-case');
    } else {
      handleNavigate(tab);
    }
  };

  const displayName = userProfile?.full_name || user?.email || 'User';

  // Redirect if not authenticated
  if (!authLoading && !user) {
    window.location.href = '/auth';
    return null;
  }

  // Handle selected states
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

  // Show loading only when auth is loading or when we have no data and are still loading
  const showLoading = authLoading || (casesLoading && cases.length === 0);

  if (showLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 dark:from-slate-900 dark:to-slate-800">
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
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex w-full">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader 
            isOnline={isOnline} 
            onHomeClick={handleHomeClick} 
            onSignOut={handleSignOut} 
          />

          <div className="flex-1">
            <DashboardContent
              activeTab={activeTab}
              isOnline={isOnline}
              hasOfflineData={hasOfflineData}
              cases={cases}
              loading={casesLoading}
              isResyncing={isResyncing}
              displayName={displayName}
              onNavigate={handleEnhancedNavigate}
              onModelFound={handleModelFound}
              onPartFound={handlePartFound}
              onCaseClick={handleCaseClick}
              onResync={handleResyncWrapper}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default IndexPage;
