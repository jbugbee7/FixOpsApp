
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RefreshCw, Settings } from 'lucide-react';
import CaseForm from '@/components/CaseForm';
import CaseDetails from '@/components/CaseDetails';
import SettingsPage from '@/components/SettingsPage';
import AiAssistantPage from '@/components/AiAssistantPage';
import TrainingPage from '@/components/TrainingPage';
import SearchBar from '@/components/SearchBar';
import ModelDetails from '@/components/ModelDetails';
import PartDetails from '@/components/PartDetails';
import CustomToast from '@/components/CustomToast';
import AppHeader from '@/components/AppHeader';
import ConnectionStatusBanner from '@/components/ConnectionStatusBanner';
import WorkOrdersList from '@/components/WorkOrdersList';
import UserInfoCard from '@/components/UserInfoCard';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useCaseOperations } from '@/hooks/useCaseOperations';

interface Case {
  id: string;
  customer_name: string;
  appliance_brand: string;
  appliance_type: string;
  status: string;
  created_at: string;
  customer_phone?: string;
  customer_address?: string;
  problem_description: string;
  initial_diagnosis?: string;
}

const Index = () => {
  const { user, userProfile, signOut } = useAuth();
  const isOnline = useNetworkStatus();
  const { cases, loading, hasOfflineData, updateCaseStatus, handleResync } = useCaseOperations(user, isOnline);
  
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [selectedPart, setSelectedPart] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isResyncing, setIsResyncing] = useState(false);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);

  // Show welcome toast when user signs in
  useEffect(() => {
    if (user && !loading) {
      setShowWelcomeToast(true);
    }
  }, [user, loading]);

  const handleCaseClick = (case_: Case) => {
    setSelectedCase(case_);
  };

  const handleModelFound = (model: any) => {
    setSelectedModel(model);
    setSelectedCase(null);
    setSelectedPart(null);
  };

  const handlePartFound = (part: any) => {
    setSelectedPart(part);
    setSelectedCase(null);
    setSelectedModel(null);
  };

  const handleHomeClick = () => {
    setSelectedCase(null);
    setSelectedModel(null);
    setSelectedPart(null);
    setActiveTab('dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
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
        onBack={() => setSelectedCase(null)} 
        onStatusUpdate={updateCaseStatus}
      />
    );
  }

  if (selectedModel) {
    return (
      <ModelDetails 
        model={selectedModel} 
        onBack={() => setSelectedModel(null)} 
      />
    );
  }

  if (selectedPart) {
    return (
      <PartDetails 
        part={selectedPart} 
        onBack={() => setSelectedPart(null)} 
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
          <TabsContent value="dashboard" className="m-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
              {/* Search Bar */}
              <div className="mb-8">
                <SearchBar 
                  onNavigate={handleNavigate} 
                  onModelFound={handleModelFound}
                  onPartFound={handlePartFound}
                />
              </div>

              {/* Connection Status Banner */}
              <ConnectionStatusBanner isOnline={isOnline} hasOfflineData={hasOfflineData} />

              {/* Recent Work Orders - Centered */}
              <WorkOrdersList 
                cases={cases} 
                loading={loading} 
                onCaseClick={handleCaseClick} 
              />

              {/* Resync Button - Bottom Center */}
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={handleResyncWrapper}
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
          </TabsContent>

          <TabsContent value="add-case" className="m-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <CaseForm />
            </div>
          </TabsContent>

          <TabsContent value="ai-assistant" className="m-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AiAssistantPage />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="m-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <TrainingPage />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="m-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center mb-8">
                <Settings className="h-16 w-16 text-slate-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Settings</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">App configuration and preferences</p>
              </div>
              <SettingsPage />
            </div>
          </TabsContent>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </Tabs>

      {/* Custom Welcome Toast */}
      {showWelcomeToast && (
        <CustomToast
          message="Welcome back!"
          onClose={() => setShowWelcomeToast(false)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default Index;
