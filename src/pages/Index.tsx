import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, BarChart3, Settings, Wrench, Calendar, Clock, CheckCircle, Home, LogIn, Bot } from 'lucide-react';
import CaseForm from '@/components/CaseForm';
import CaseDetails from '@/components/CaseDetails';
import SettingsPage from '@/components/SettingsPage';
import AiAssistantPage from '@/components/AiAssistantPage';
import AnalyticsPage from '@/components/AnalyticsPage';

const Index = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cases, setCases] = useState([
    { id: 1, customer: "John Smith", appliance: "Whirlpool Dishwasher", status: "In Progress", date: "2024-05-27", phone: "(555) 123-4567", address: "123 Main St", problemDescription: "Dishwasher not draining properly", initialDiagnosis: "Likely clogged drain hose" },
    { id: 2, customer: "Sarah Johnson", appliance: "GE Refrigerator", status: "Completed", date: "2024-05-26", phone: "(555) 987-6543", address: "456 Oak Ave", problemDescription: "Refrigerator not cooling", initialDiagnosis: "Faulty compressor" },
    { id: 3, customer: "Mike Davis", appliance: "Maytag Washer", status: "Scheduled", date: "2024-05-28", phone: "(555) 456-7890", address: "789 Pine St", problemDescription: "Washer making loud noise", initialDiagnosis: "Worn drum bearings" },
  ]);

  const stats = [
    { label: "Cases This Week", value: "12", icon: <FileText className="h-5 w-5" /> },
    { label: "Completion Rate", value: "94%", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Avg. Repair Time", value: "2.3h", icon: <Clock className="h-5 w-5" /> },
    { label: "Next Appointment", value: "2:00 PM", icon: <Calendar className="h-5 w-5" /> },
  ];

  // Mock user data
  const user = {
    name: "Alex Johnson"
  };

  const updateCaseStatus = (caseId, newStatus) => {
    setCases(cases.map(case_ => 
      case_.id === caseId ? { ...case_, status: newStatus } : case_
    ));
  };

  const handleCaseClick = (case_) => {
    setSelectedCase(case_);
  };

  const handleHomeClick = () => {
    setSelectedCase(null);
    setActiveTab('dashboard');
  };

  const handleSignIn = () => {
    console.log("User attempting to sign in");
  };

  const handleSignOut = () => {
    console.log("User signed out");
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
            
            {/* Center - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FixOps
                </h1>
              </div>
            </div>
            
            {/* Right - Sign In */}
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={handleSignIn} className="flex items-center space-x-2 pr-2">
                <LogIn className="h-4 w-4" />
                <span className="text-sm">Sign In</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex-1">
          <TabsContent value="dashboard" className="m-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index} className="dark:bg-slate-800 dark:border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Cases - Centered */}
              <div className="flex justify-center">
                <Card className="dark:bg-slate-800 dark:border-slate-700 w-full max-w-4xl">
                  <CardHeader className="text-center">
                    <CardTitle className="dark:text-slate-100">Recent Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cases.map((case_) => (
                        <div 
                          key={case_.id} 
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                          onClick={() => handleCaseClick(case_)}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 dark:text-slate-100">{case_.customer}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{case_.appliance}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{case_.date}</p>
                          </div>
                          <Badge 
                            variant={case_.status === 'Completed' ? 'default' : case_.status === 'In Progress' ? 'secondary' : 'outline'}
                          >
                            {case_.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Login Info - Bottom Right */}
              <div className="fixed bottom-20 right-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
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
              <AnalyticsPage />
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
              <span className="text-xs">Add Case</span>
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
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
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
