
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkflowRules from './automation/WorkflowRules';
import AutomatedTasks from './automation/AutomatedTasks';
import LeadScoring from './automation/LeadScoring';
import CommunicationTemplates from './automation/CommunicationTemplates';

const AutomationTab = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Workflow Automation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Automate your customer relationship management processes
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="workflows" className="text-xs sm:text-sm">Workflows</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs sm:text-sm">Tasks</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs sm:text-sm">Templates</TabsTrigger>
          <TabsTrigger value="scoring" className="text-xs sm:text-sm">Lead Scoring</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows">
          <WorkflowRules />
        </TabsContent>

        <TabsContent value="tasks">
          <AutomatedTasks />
        </TabsContent>

        <TabsContent value="templates">
          <CommunicationTemplates />
        </TabsContent>

        <TabsContent value="scoring">
          <LeadScoring />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationTab;
