import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart3, Settings, Wrench, RefreshCw, Home, LogOut, Bot, GraduationCap } from 'lucide-react';
import CaseForm from '@/components/CaseForm';
import CaseDetails from '@/components/CaseDetails';
import SettingsPage from '@/components/SettingsPage';
import AiAssistantPage from '@/components/AiAssistantPage';
import TrainingPage from '@/components/TrainingPage';
import SearchBar from '@/components/SearchBar';
import ModelDetails from '@/components/ModelDetails';
import PartDetails from '@/components/PartDetails';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [selectedPart, setSelectedPart] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [isResyncing, setIsResyncing] = useState(false);

  // Fetch cases from Supabase
  const fetchCases = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cases:', error);
        toast({
          title: "Error Loading Work Orders",
          description: "Failed to load work orders from database.",
          variant: "destructive"
        });
        return;
      }

      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast({
        title: "Error Loading Work Orders", 
        description: "An unexpected error occurred while loading work orders.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for cases
  useEffect(() => {
    if (!user) return;

    fetchCases();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('cases-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cases'
        },
        (payload) => {
          console.log('Real-time change received:', payload);
          fetchCases(); // Refetch cases when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const updateCaseStatus = async (caseId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('cases')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', caseId);

      if (error) {
        console.error('Error updating case status:', error);
        toast({
          title: "Error Updating Work Order",
          description: "Failed to update work order status.",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setCases(cases.map(case_ => 
        case_.id === caseId ? { ...case_, status: newStatus } : case_
      ));

      toast({
        title: "Work Order Updated",
        description: `Work order status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating case status:', error);
      toast({
        title: "Error Updating Work Order",
        description: "An unexpected error occurred while updating the work order.",
        variant: "destructive"
      });
    }
  };

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

  const handleResync = async () => {
    setIsResyncing(true);
    try {
      await fetchCases();
      toast({
        title: "Resync Complete",
        description: "All data has been synchronized with the server.",
      });
    } catch (error) {
      toast({
        title: "Resync Failed",
        description: "Failed to synchronize data. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsResyncing(false);
    }
  };

  // Get display name - prioritize full name from profile, fallback to email
  const displayName = userProfile?.full_name || user?.email || 'User';

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 dark:bg-slate-900/80 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Home Button */}
            <Button variant="ghost" size="sm" onClick={handleHomeClick} className="flex items-center">
              <Home className="h-6 w-6" />
            </Button>
            
            {/* Center - Logo with wrench icon */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
              <Wrench className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FixOps
                </h1>
              </div>
            </div>
            
            {/* Right - Sign Out */}
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex items-center space-x-2 pr-2">
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

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

              {/* Recent Work Orders - Centered */}
              <div className="flex justify-center">
                <Card className="dark:bg-slate-800 dark:border-slate-700 w-full max-w-4xl">
                  <CardHeader className="text-center">
                    <CardTitle className="dark:text-slate-100">Recent Workorders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <p className="text-slate-600 dark:text-slate-400">Loading work orders...</p>
                      </div>
                    ) : cases.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-600 dark:text-slate-400">No work orders found. Create your first work order using the Add WO tab.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cases.slice(0, 5).map((case_) => (
                          <div 
                            key={case_.id} 
                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                            onClick={() => handleCaseClick(case_)}
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 dark:text-slate-100">{case_.customer_name}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-300">{case_.appliance_brand} {case_.appliance_type}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(case_.created_at)}</p>
                            </div>
                            <Badge 
                              variant={case_.status === 'Completed' ? 'default' : case_.status === 'In Progress' ? 'secondary' : 'outline'}
                            >
                              {case_.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Resync Button - Bottom Center */}
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={handleResync}
                  disabled={isResyncing}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isResyncing ? 'animate-spin' : ''}`} />
                  <span>{isResyncing ? 'Resyncing...' : 'Resync Data'}</span>
                </Button>
              </div>

              {/* User Info - Bottom Right with name instead of email */}
              <div className="fixed bottom-20 right-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{displayName}</p>
                </div>
              </div>
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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg">
          <TabsList className="grid w-full grid-cols-5 h-16 bg-white dark:bg-slate-900 rounded-none">
            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="add-case" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add WO</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-assistant" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20"
            >
              <Bot className="h-5 w-5" />
              <span className="text-xs">FixBot</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20"
            >
              <GraduationCap className="h-5 w-5" />
              <span className="text-xs">Training</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20"
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default Index;
