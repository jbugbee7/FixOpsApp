
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadScoring from './LeadScoring';
import AutomatedTasks from './AutomatedTasks';
import WorkflowRules from './WorkflowRules';
import EmailTemplates from './EmailTemplates';
import CommunicationTemplates from './CommunicationTemplates';
import CustomerHealthDashboard from './CustomerHealthDashboard';

const AutomationTab = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">CRM Automation</h2>
        <p className="text-muted-foreground">
          Automate customer interactions, scoring, and workflow management
        </p>
      </div>

      <Tabs defaultValue="lead-scoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="lead-scoring" className="text-xs">Lead Scoring</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">Tasks</TabsTrigger>
          <TabsTrigger value="workflows" className="text-xs">Workflows</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
          <TabsTrigger value="communication" className="text-xs">Communication</TabsTrigger>
          <TabsTrigger value="health" className="text-xs">Health</TabsTrigger>
        </TabsList>

        <TabsContent value="lead-scoring" className="space-y-6">
          <LeadScoring />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <AutomatedTasks />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <WorkflowRules />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <EmailTemplates />
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <CommunicationTemplates />
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <CustomerHealthDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationTab;
