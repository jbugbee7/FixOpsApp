
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Plus, FileText, BarChart3, Settings, Wrench, Calendar, Clock, CheckCircle } from 'lucide-react';
import CaseForm from '@/components/CaseForm';

const Index = () => {
  const recentCases = [
    { id: 1, customer: "John Smith", appliance: "Whirlpool Dishwasher", status: "In Progress", date: "2024-05-27" },
    { id: 2, customer: "Sarah Johnson", appliance: "GE Refrigerator", status: "Completed", date: "2024-05-26" },
    { id: 3, customer: "Mike Davis", appliance: "Maytag Washer", status: "Scheduled", date: "2024-05-28" },
  ];

  const stats = [
    { label: "Cases This Week", value: "12", icon: <FileText className="h-5 w-5" /> },
    { label: "Completion Rate", value: "94%", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Avg. Repair Time", value: "2.3h", icon: <Clock className="h-5 w-5" /> },
    { label: "Next Appointment", value: "2:00 PM", icon: <Calendar className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FixOps
                </h1>
                <p className="text-sm text-slate-600">Repair Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-slate-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Tech #1001</p>
                <p className="text-xs text-slate-600">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <div className="flex-1">
          <TabsContent value="dashboard" className="m-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                          <p className="text-xs text-slate-600">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Cases */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Cases</CardTitle>
                  <CardDescription>Your latest repair assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCases.map((case_) => (
                      <div key={case_.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{case_.customer}</h4>
                          <p className="text-sm text-slate-600">{case_.appliance}</p>
                          <p className="text-xs text-slate-500">{case_.date}</p>
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
          </TabsContent>

          <TabsContent value="add-case" className="m-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <CaseForm />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="m-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
              <BarChart3 className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Analytics</h2>
              <p className="text-lg text-slate-600">Performance metrics and insights coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="m-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
              <Settings className="h-16 w-16 text-slate-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Settings</h2>
              <p className="text-lg text-slate-600">App configuration and preferences</p>
            </div>
          </TabsContent>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
          <TabsList className="grid w-full grid-cols-4 h-16 bg-white rounded-none">
            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="add-case" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add Case</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
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
