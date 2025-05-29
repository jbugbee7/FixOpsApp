
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useSafariCaseOperations } from '@/hooks/useSafariCaseOperations';
import { useIndexState } from '@/hooks/useIndexState';
import IndexPage from '@/components/dashboard/IndexPage';

const Index = () => {
  const { user, userProfile, signOut, loading: authLoading } = useAuth();
  const isOnline = useNetworkStatus();
  
  const { cases, loading: casesLoading, hasError, hasOfflineData, updateCaseStatus, handleResync } = useSafariCaseOperations(user, isOnline);
  
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

  return (
    <IndexPage
      user={user}
      userProfile={userProfile}
      signOut={signOut}
      authLoading={authLoading}
      isOnline={isOnline}
      cases={cases}
      loading={casesLoading}
      hasOfflineData={hasOfflineData}
      updateCaseStatus={updateCaseStatus}
      handleResync={handleResync}
      selectedCase={selectedCase}
      selectedModel={selectedModel}
      selectedPart={selectedPart}
      activeTab={activeTab}
      isResyncing={isResyncing}
      setActiveTab={setActiveTab}
      setIsResyncing={setIsResyncing}
      handleCaseClick={handleCaseClick}
      handleModelFound={handleModelFound}
      handlePartFound={handlePartFound}
      handleHomeClick={handleHomeClick}
      handleNavigate={handleNavigate}
    />
  );
};

export default Index;
