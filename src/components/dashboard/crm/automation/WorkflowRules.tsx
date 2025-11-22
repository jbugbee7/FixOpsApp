import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Zap, Mail, Phone, Calendar, User } from 'lucide-react';

interface WorkflowRule {
  id: number;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  executionCount: number;
}

const WorkflowRules = () => {
  const [rules, setRules] = useState<WorkflowRule[]>([
    {
      id: 1,
      name: "New Lead Assignment",
      trigger: "When a new customer is added",
      action: "Assign to available technician",
      enabled: true,
      executionCount: 24
    },
    {
      id: 2,
      name: "Follow-up Reminder",
      trigger: "3 days after service completion",
      action: "Send follow-up email",
      enabled: true,
      executionCount: 18
    },
    {
      id: 3,
      name: "High-Value Customer Alert",
      trigger: "Customer lifetime value exceeds $1000",
      action: "Notify sales team",
      enabled: false,
      executionCount: 7
    },
    {
      id: 4,
      name: "Inactive Customer Re-engagement",
      trigger: "No contact for 60 days",
      action: "Send re-engagement email",
      enabled: true,
      executionCount: 12
    }
  ]);

  const toggleRule = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getTriggerIcon = (trigger: string) => {
    if (trigger.includes('new')) return <User className="h-4 w-4" />;
    if (trigger.includes('days')) return <Calendar className="h-4 w-4" />;
    if (trigger.includes('value')) return <Zap className="h-4 w-4" />;
    return <Mail className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Workflow Automation Rules</CardTitle>
              <CardDescription>
                Automate repetitive tasks and streamline your CRM processes
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1 p-2 rounded-lg bg-primary/10">
                        {getTriggerIcon(rule.trigger)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{rule.name}</h4>
                          {rule.enabled ? (
                            <Badge variant="secondary" className="bg-secondary/10 text-secondary">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><span className="font-medium">Trigger:</span> {rule.trigger}</p>
                          <p><span className="font-medium">Action:</span> {rule.action}</p>
                          <p className="text-xs">Executed {rule.executionCount} times</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowRules;
